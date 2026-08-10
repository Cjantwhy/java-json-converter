# 生成 1200x630 的 OG 分享占位图（中英各一张）。
# 一次性运行：powershell -ExecutionPolicy Bypass -File scripts/generate-og-image.ps1
# 用 Windows 原生 System.Drawing，无需安装任何依赖。
# 输出：public/og-zh.png、public/og-en.png

param(
    [string]$OutDir = "public"
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$width = 1200
$height = 630

# 站点配色（对齐 Tailwind gray-950 / blue-600 / gray-400）
$bg = [System.Drawing.Color]::FromArgb(3, 7, 18)       # #030712 gray-950
$panel = [System.Drawing.Color]::FromArgb(17, 24, 39)  # #111827 gray-900
$white = [System.Drawing.Color]::White
$sub = [System.Drawing.Color]::FromArgb(156, 163, 175) # #9ca3af gray-400
$accent = [System.Drawing.Color]::FromArgb(37, 99, 235) # #2563eb blue-600

function New-OgImage {
    param(
        [string]$OutPath,
        [string]$Eyebrow,     # 顶部小标签
        [string]$Title,       # 主标题
        [string]$Subtitle     # 副标题
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear($bg)

    # 顶部强调条
    $accentBrush = New-Object System.Drawing.SolidBrush($accent)
    $g.FillRectangle($accentBrush, 0, 0, $width, 6)

    # 字体（中文系统含 Microsoft YaHei；英文 Segoe UI）
    $titleFont = New-Object System.Drawing.Font("Segoe UI, Microsoft YaHei", 76, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $subFont = New-Object System.Drawing.Font("Segoe UI, Microsoft YaHei", 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI, Microsoft YaHei", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

    $titleBrush = New-Object System.Drawing.SolidBrush($white)
    $subBrush = New-Object System.Drawing.SolidBrush($sub)
    $eyebrowBrush = New-Object System.Drawing.SolidBrush($accent)

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Near

    # 测量
    $titleSize = $g.MeasureString($Title, $titleFont, $width, $sf)
    $subSize = $g.MeasureString($Subtitle, $subFont, $width, $sf)
    $eyebrowSize = $g.MeasureString($Eyebrow, $eyebrowFont, $width, $sf)

    $gap = 18
    $totalH = $eyebrowSize.Height + $titleSize.Height + $subSize.Height + ($gap * 2)
    $y = ($height - $totalH) / 2

    $rectEyebrow = New-Object System.Drawing.RectangleF(0, $y, $width, $eyebrowSize.Height)
    $g.DrawString($Eyebrow, $eyebrowFont, $eyebrowBrush, $rectEyebrow, $sf)
    $y += $eyebrowSize.Height + $gap

    $rectTitle = New-Object System.Drawing.RectangleF(0, $y, $width, $titleSize.Height)
    $g.DrawString($Title, $titleFont, $titleBrush, $rectTitle, $sf)
    $y += $titleSize.Height + $gap

    $rectSub = New-Object System.Drawing.RectangleF(0, $y, $width, $subSize.Height)
    $g.DrawString($Subtitle, $subFont, $subBrush, $rectSub, $sf)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Generated: $OutPath"
}

New-OgImage -OutPath (Join-Path $OutDir "og-zh.png") `
    -Eyebrow "ONLINE TOOL" `
    -Title "Java Entity -> JSON" `
    -Subtitle "Java 实体类转 JSON 在线工具"

New-OgImage -OutPath (Join-Path $OutDir "og-en.png") `
    -Eyebrow "ONLINE TOOL" `
    -Title "Java Entity -> JSON" `
    -Subtitle "Online Converter - POJO to JSON example"
