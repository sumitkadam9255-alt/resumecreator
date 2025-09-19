document.addEventListener("DOMContentLoaded", function () {
    const resumeTemplates = document.querySelectorAll(".resume-template");
    const userForm = document.getElementById("user-form");
    const preview = document.getElementById("resume-preview");
    let selectedTemplate = "1"; // default
    let photoBase64 = "";

    // Template select
    resumeTemplates.forEach(template => {
        template.addEventListener("click", function () {
            selectedTemplate = this.getAttribute("data-template");
            updatePreview();
        });
    });

    // Add More buttons
    document.getElementById("add-education").addEventListener("click", () => {
        const container = document.getElementById("education-container");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "education-entry";
        input.placeholder = "Degree, Institute, Year";
        container.appendChild(input);
        input.addEventListener("input", updatePreview);
    });

    document.getElementById("add-experience").addEventListener("click", () => {
        const container = document.getElementById("experience-container");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "experience-entry";
        input.placeholder = "Role at Company, Years";
        container.appendChild(input);
        input.addEventListener("input", updatePreview);
    });

    // Convert photo to Base64 for preview/PDF
    document.getElementById("photo").addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                photoBase64 = e.target.result;
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Update preview on input change
    document.querySelectorAll("#user-form input, #user-form textarea").forEach(el => {
        el.addEventListener("input", updatePreview);
    });

    function updatePreview() {
        const name = document.getElementById("name").value || "Your Name";
        const email = document.getElementById("email").value || "your@email.com";
        const phone = document.getElementById("phone").value || "1234567890";
        const summary = document.getElementById("summary").value || "Profile summary goes here...";
        const skills = document.getElementById("skills").value || "HTML, CSS, JavaScript";
        const languages = document.getElementById("languages").value || "English";
        const educationEntries = Array.from(document.querySelectorAll(".education-entry"))
            .map(input => `<li>${input.value || "Education entry"}</li>`).join("");
        const experienceEntries = Array.from(document.querySelectorAll(".experience-entry"))
            .map(input => `<li>${input.value || "Experience entry"}</li>`).join("");

        let photoHTML = photoBase64 ? `<img src="${photoBase64}" alt="Profile Photo">` : "";

        let resumeContent = "";

        // Template 1
        if (selectedTemplate === "1") {
            resumeContent = `
            <div style="display:flex;font-family:Arial;">
              <div style="width:30%;background:#2c3e50;color:white;padding:20px;text-align:center;">
                ${photoHTML}
                <h2>${name}</h2>
                <p>${summary}</p>
                <h3>Contact</h3>
                <p>${email}</p><p>${phone}</p>
                <h3>Languages</h3><p>${languages}</p>
              </div>
              <div style="width:70%;padding:20px;">
                <h3>Education</h3><ul>${educationEntries}</ul>
                <h3>Skills</h3><p>${skills}</p>
                <h3>Experience</h3><ul>${experienceEntries}</ul>
              </div>
            </div>`;
        }
        // Template 2
        else if (selectedTemplate === "2") {
            resumeContent = `
            <div style="font-family:Verdana;text-align:center;">
              ${photoHTML}
              <h1 style="color:#007bff;">${name}</h1>
              <p>📧 ${email} | 📞 ${phone}</p><hr/>
              <h2>Profile</h2><p>${summary}</p>
              <h2>Education</h2><ul>${educationEntries}</ul>
              <h2>Skills</h2><ul>${skills.split(",").map(s=>`<li>${s.trim()}</li>`).join("")}</ul>
              <h2>Experience</h2><ul>${experienceEntries}</ul>
              <h2>Languages</h2><p>${languages}</p>
            </div>`;
        }
        // Template 3
        else if (selectedTemplate === "3") {
            resumeContent = `
            <div style="font-family:'Segoe UI';border:2px solid #333;padding:20px;border-radius:12px;">
              <div style="text-align:center;">
                ${photoHTML}
                <h1>${name}</h1><p>${email} | ${phone}</p>
              </div><hr/>
              <h2>Profile</h2><p>${summary}</p>
              <h2>Education</h2><ul>${educationEntries}</ul>
              <h2>Skills</h2><p>${skills}</p>
              <h2>Experience</h2><ul>${experienceEntries}</ul>
              <h2>Languages</h2><p>${languages}</p>
            </div>`;
        }

        preview.innerHTML = resumeContent;
    }

    // Generate PDF
    userForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value || "Resume";

        html2pdf()
          .set({
            margin: 0.5,
            filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
          })
          .from(preview)
          .save();
    });

    // Initial preview
    updatePreview();
});
