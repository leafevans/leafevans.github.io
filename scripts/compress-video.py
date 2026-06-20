#!/usr/bin/env python3
"""
视频压缩脚本 - 在尽量不影响质量的情况下压缩视频文件大小
用法: python compress-video.py <input_path> [output_path] [max_size_mb]
"""

import subprocess
import sys
import os
import shutil


def check_ffmpeg():
    """检查ffmpeg是否安装"""
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def get_video_duration(input_path):
    """获取视频时长（秒）"""
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        input_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return float(result.stdout.strip())


def get_video_info(input_path):
    """获取视频信息"""
    cmd = [
        "ffprobe",
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height,r_frame_rate,bit_rate",
        "-show_entries", "format=bit_rate,size",
        "-of", "json",
        input_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    import json
    return json.loads(result.stdout)


def compress_video(input_path, output_path, max_size_mb=100, min_quality=True):
    """
    压缩视频文件
    
    Args:
        input_path: 输入文件路径
        output_path: 输出文件路径
        max_size_mb: 最大文件大小（MB）
        min_quality: 是否尽量保持高质量
    """
    # 获取原始文件大小
    original_size = os.path.getsize(input_path)
    max_size_bytes = max_size_mb * 1024 * 1024
    
    if original_size <= max_size_bytes:
        print(f"文件已经小于 {max_size_mb}MB，无需压缩")
        shutil.copy2(input_path, output_path)
        return
    
    # 获取视频信息
    duration = get_video_duration(input_path)
    info = get_video_info(input_path)
    
    # 计算目标比特率
    # 预留5%的空间给音频
    target_total_bitrate = (max_size_bytes * 8) / duration * 0.95
    
    # 设置视频比特率（分配85%给视频，15%给音频）
    video_bitrate = int(target_total_bitrate * 0.85)
    audio_bitrate = int(target_total_bitrate * 0.15)
    
    # 确保最低比特率
    min_video_bitrate = 500000  # 500kbps
    min_audio_bitrate = 64000   # 64kbps
    
    video_bitrate = max(video_bitrate, min_video_bitrate)
    audio_bitrate = max(audio_bitrate, min_audio_bitrate)
    
    print(f"原始文件大小: {original_size / 1024 / 1024:.2f} MB")
    print(f"目标文件大小: {max_size_mb} MB")
    print(f"视频时长: {duration:.2f} 秒")
    print(f"目标视频比特率: {video_bitrate / 1000:.0f} kbps")
    print(f"目标音频比特率: {audio_bitrate / 1000:.0f} kbps")
    
    # 构建ffmpeg命令
    cmd = [
        "ffmpeg",
        "-i", input_path,
        "-c:v", "libx264",           # 使用H.264编码
        "-b:v", str(video_bitrate),  # 视频比特率
        "-maxrate", str(int(video_bitrate * 1.5)),  # 最大比特率
        "-bufsize", str(int(video_bitrate * 2)),    # 缓冲区大小
        "-preset", "slow" if min_quality else "medium",  # 编码速度/质量平衡
        "-crf", "23" if min_quality else "26",     # 质量因子（越小质量越好）
        "-c:a", "aac",               # 音频编码
        "-b:a", str(audio_bitrate),  # 音频比特率
        "-movflags", "+faststart",   # 优化网络播放
        "-y",                        # 覆盖输出文件
        output_path
    ]
    
    print("\n开始压缩...")
    print(f"命令: {' '.join(cmd)}")
    
    # 执行压缩
    process = subprocess.run(cmd, capture_output=True, text=True)
    
    if process.returncode != 0:
        print(f"压缩失败: {process.stderr}")
        return
    
    # 检查输出文件大小
    output_size = os.path.getsize(output_path)
    compression_ratio = (1 - output_size / original_size) * 100
    
    print(f"\n压缩完成!")
    print(f"输出文件: {output_path}")
    print(f"输出文件大小: {output_size / 1024 / 1024:.2f} MB")
    print(f"压缩率: {compression_ratio:.1f}%")
    
    # 如果还是太大，尝试进一步压缩
    if output_size > max_size_bytes:
        print(f"\n文件仍然超过 {max_size_mb}MB，尝试进一步压缩...")
        # 使用更低的比特率重新压缩
        video_bitrate = int(video_bitrate * 0.8)
        cmd[cmd.index("-b:v") + 1] = str(video_bitrate)
        subprocess.run(cmd, capture_output=True, text=True)
        
        output_size = os.path.getsize(output_path)
        print(f"最终文件大小: {output_size / 1024 / 1024:.2f} MB")


def main():
    if len(sys.argv) < 2:
        print("用法: python compress-video.py <input_path> [output_path] [max_size_mb]")
        print("示例: python compress-video.py video.mp4 video-compressed.mp4 95")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    if not os.path.exists(input_path):
        print(f"错误: 找不到文件 {input_path}")
        sys.exit(1)
    
    # 默认输出文件名
    if len(sys.argv) >= 3:
        output_path = sys.argv[2]
    else:
        name, ext = os.path.splitext(input_path)
        output_path = f"{name}-compressed{ext}"
    
    # 默认最大文件大小
    max_size_mb = 95 if len(sys.argv) < 4 else int(sys.argv[3])
    
    if not check_ffmpeg():
        print("错误: 未安装ffmpeg")
        print("请先安装ffmpeg: https://ffmpeg.org/download.html")
        sys.exit(1)
    
    compress_video(input_path, output_path, max_size_mb)


if __name__ == "__main__":
    main()
