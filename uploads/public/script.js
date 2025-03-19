document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Log form data to console (for testing)
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    // Send form data to the server
    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Update the download link with the uploaded file's URL
        if (data.fileUrl) {
            document.getElementById('downloadLink').href = data.fileUrl;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});