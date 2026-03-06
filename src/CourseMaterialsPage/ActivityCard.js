const ActivityCard = ({ material, fetchProgress, isEnglish }) => {

  const HandleUpload = async (event, materialId) => {

    const file = event.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("material_id", materialId);

    try {
      const res = await fetch(
         "http://localhost:5000/api/upload-free-course",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );
console.log("mterials id :", formData);
      if (!res.ok) throw new Error("Upload failed");

      alert("Upload successful ✅");
      await fetchProgress();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body text-center">
        <h6 className="fw-bold"> {material.title}</h6>
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-outline-primary w-100 mb-2`}
          download
        >
          {isEnglish ? "Download" : "قم بتنزيل الواجب المنزلي "}
        </a>

        <label className="btn btn-success w-100 mt-2">
          {isEnglish ? "Upload Your Work" : "تحميل الواجب"}
          <input
            type="file"
            hidden
            onChange={(e) => HandleUpload(e, material.id)}
          />
        </label>
      </div>
    </div>
  )
}
export default ActivityCard;
