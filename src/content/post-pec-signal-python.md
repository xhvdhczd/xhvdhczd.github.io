---
title: 用 Python 提取脉冲涡流信号特征
date: 2026-07-20
tags: [脉冲涡流, Python, 信号处理]
excerpt: 用 SciPy 对 PEC 时域信号做去噪、峰值检测与特征时间常数拟合。
slug: pec-signal-python
---

# 用 Python 提取脉冲涡流信号特征

本文给出一个最小可复现的示例，演示如何对脉冲涡流时域信号做预处理并提取特征。

## 1. 生成仿真信号

```python
import numpy as np
import matplotlib.pyplot as plt

def pec_signal(t, A=1.0, tau=0.8e-3, f=2.5e3, noise=0.02):
    """生成带噪声的脉冲涡流衰减信号（仿真）。"""
    clean = A * np.exp(-t / tau) * np.sin(2 * np.pi * f * t)
    return clean + noise * np.random.randn(len(t))

t = np.linspace(0, 4e-3, 2000)
v = pec_signal(t)
```

## 2. 去噪（小波/滑动平均）

这里使用 Savitzky–Golay 平滑：

```python
from scipy.signal import savgol_filter

v_smooth = savgol_filter(v, window_length=51, polyorder=3)
```

## 3. 峰值检测与特征提取

```python
from scipy.signal import find_peaks

peaks, props = find_peaks(v_smooth, height=0.1, distance=20)
peak_time = t[peaks[0]]          # 首个峰值时刻
peak_amp = props["peak_heights"][0]

print(f"峰值时刻: {peak_time * 1e3:.3f} ms")
print(f"峰值幅值: {peak_amp:.4f}")
```

## 4. 拟合特征时间常数 τ

对信号包络做指数拟合，即可得到与壁厚相关的 `τ`：

```python
from scipy.optimize import curve_fit

def envelope(t, A, tau, f, phi):
    return A * np.exp(-t / tau) * np.sin(2 * np.pi * f * t + phi)

popt, _ = curve_fit(envelope, t, v_smooth, p0=[1.0, 0.8e-3, 2.5e3, 0.0])
tau_fit = popt[1]
print(f"拟合得到 τ = {tau_fit * 1e3:.3f} ms")
```

## 小结

| 步骤 | 目的 |
| --- | --- |
| 平滑 | 抑制噪声 |
| 峰值检测 | 定位关键特征点 |
| 指数拟合 | 估计壁厚相关参数 |

特征值与壁厚的映射需结合标定实验，下一步可引入机器学习做反演。
