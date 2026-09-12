import os
from PIL import Image

ASSETS_DIR = r"c:\Projetos\Marinha\EPM\public\assets"

files = [
    "Guia_Técnico_de_Sobrevivência_Pessoal.png",
    "Guia_de_Sobrevivência_Marítima.png",
    "Guia_de_Sobrevivência_e_Emergência.png"
]

print("Iniciando conversão para WebP...")
for filename in files:
    png_path = os.path.join(ASSETS_DIR, filename)
    base_name = os.path.splitext(filename)[0]
    webp_path = os.path.join(ASSETS_DIR, f"{base_name}.webp")
    
    if os.path.exists(png_path):
        orig_size = os.path.getsize(png_path) / (1024 * 1024)
        with Image.open(png_path) as img:
            # Converte e salva em WebP
            img.save(webp_path, "WEBP", quality=85, method=6)
        new_size = os.path.getsize(webp_path) / (1024 * 1024)
        reduction = (1 - (new_size / orig_size)) * 100
        print(f"[OK] {filename} ({orig_size:.2f} MB) -> {base_name}.webp ({new_size:.2f} MB) [{reduction:.1f}% menor]")
    else:
        print(f"[AVISO] Arquivo não encontrado: {png_path}")

print("Conversão finalizada com sucesso!")
