from PIL import Image
import os

input_path = "/Users/sagihoz/.gemini/antigravity/brain/e4c1d63d-98f5-4ac9-9de7-d7994bd086ba/uploaded_image_1766625764831.jpg"
output_webp = "/Users/sagihoz/דמו/images/dr_shezer_white.webp"
output_png = "/Users/sagihoz/דמו/images/dr_shezer_white.png" # Ideally we keep a PNG fallback too if referenced, or just replace both logic

# Target size roughly 128KB
target_size_kb = 128

def convert_image():
    if not os.path.exists(input_path):
        print(f"Error: Input file not found at {input_path}")
        return

    with Image.open(input_path) as img:
        # Resize if too large (e.g. > 1000px width might be unnecessary for this use case if it's just a portrait)
        # The uploaded image is 1024x1008, which is reasonable. We can keep it or slightly resize.
        # Let's keep dimensions but optimize quality.
        
        # Save as WebP
        quality = 90
        while quality > 10:
            img.save(output_webp, "WEBP", quality=quality)
            size_kb = os.path.getsize(output_webp) / 1024
            if size_kb <= target_size_kb:
                print(f"Saved WebP at quality {quality}, size: {size_kb:.2f}KB")
                break
            quality -= 5
        else:
             print(f"Warning: Could not get under {target_size_kb}KB, saved at {quality+5}, size: {os.path.getsize(output_webp)/1024:.2f}KB")

        # Also save as PNG for fallback consistency (though user specifically asked for WebP)
        # We'll just save a standard PNG
        img.save(output_png, "PNG", optimize=True)
        print(f"Saved PNG backup, size: {os.path.getsize(output_png)/1024:.2f}KB")

if __name__ == "__main__":
    convert_image()
