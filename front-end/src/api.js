import axios from "axios";

const apiClientMultipart = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
    "Content-Type": "multipart/form-data",
    },
});

export async function requestAttachment(attachment) {
    const formData = new FormData();
    formData.append("in_file", attachment);

    const response = await apiClientMultipart.post("/analys-OCR", formData);

    return response.data

}

