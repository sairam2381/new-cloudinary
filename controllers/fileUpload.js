const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files.file;
    let path =
      __dirname + "/files/" + Date.now() + `${file.name.split(".")[1]}`;
    file.mv(path, (err) => {
      console.log(err);
    });
    res.json({
      success: true,
      message: "Local file uploaded successfully",
    });
  } catch (error) {
    console.log("Not able to upload the file on the server");
    console.log("The error has occured over here", error);
  }
};
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilepath, options);
}
exports.imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    const file = req.files.imageFile;
    const supportedType = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedType)) {
      return res.status(404).json({
        success: false,
        message: "File format not supported",
      });
    }
    console.log("Uploading to Codehelp");
    const response = await uploadFileToCloudinary(file, "my-images");
    console.log("This is after that response function");
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });
    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image successfully Uploaded",
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
