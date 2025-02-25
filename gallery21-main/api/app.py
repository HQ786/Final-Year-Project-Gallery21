from flask import Flask, request, jsonify
import torch
from diffusers import FluxPipeline
from PIL import Image
import io
import base64

app = Flask(__name__)

# Load the FLUX.1 model
pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
pipe.enable_model_cpu_offload()

@app.route('/generate-image', methods=['POST'])
def generate_image():
    try:
        # Get the prompt from the request
        data = request.get_json()
        prompt = data['prompt']

        # Generate the image
        image = pipe(
            prompt,
            guidance_scale=0.0,
            num_inference_steps=4,
            max_sequence_length=256,
            generator=torch.Generator("cpu").manual_seed(0)
        ).images[0]

        # Convert the image to base64 for easier transport
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')

        # Return the base64 image
        return jsonify({'image': img_base64})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
