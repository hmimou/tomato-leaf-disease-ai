import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import torch.nn.functional as F

#Define the transform (same as training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

#Load the model architecture
def load_model(model_path="models/model.pth", device="cpu"):
    model = models.resnet18(weights=None) 
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 10)  
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()  # set to evaluation mode
    return model

#Function to predict from image path
def predict(model, image_path, device="cpu"):
    image = Image.open(image_path).convert("RGB")  # ensure 3 channels
    img_tensor = transform(image).unsqueeze(0)  # add batch dimension
    img_tensor = img_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = F.softmax(outputs, dim=1)
        _, pred = torch.max(outputs, 1)    
    
    # Map indices to class names
    class_names = ["Tomato_Bacterial_spot",
                    "Tomato_Early_blight",
                    "Tomato_Late_blight",
                    "Tomato_Leaf_Mold",
                    "Tomato_Septoria_leaf_spot",
                    "Tomato_Spider_mites_Two_spotted_spider_mite",
                    "Tomato__Target_Spot",
                    "Tomato_YellowLeaf__Curl_Virus",
                    "Tomato_mosaic_virus",
                    "Tomato_healthy"]
    conf, predicted = torch.max(probabilities, 1)
    predicted_class = class_names[predicted.item()]
    confidence = conf.item()
    return predicted_class, confidence