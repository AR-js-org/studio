const handleImageUnload = () => {
    let preview = document.getElementById("image-preview");
    preview.innerHTML = "<file-holder></file-holder>";
};

const handleImageUpload = (event) => {
    const fileName = event.target.files[0].name;
    const fileURL = URL.createObjectURL(event.target.files[0]);
    let preview = document.getElementById("image-preview");
    const previewTemplate = `
        <style>
            img {
                object-fit: contain;
                width: 23.75em;
                height: 23.75em;
                font-size: 1.25em;
            }
            .crossmark {
                font-size: 2.25em;
            }
            .filename {
                font-style: italic;
                font-weight: bold;
                font-size: 18px;
            }
        </style>
            
        <img src=${fileURL} alt="image-preview">
        <div>
            <span class="crossmark" onclick="handleImageUnload()">&times;</span>
            <span class="filename">${fileName}</span>
        </div>
        `;

    preview.innerHTML = previewTemplate;
};
