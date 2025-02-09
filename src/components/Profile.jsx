import React, { useState } from "react";
import "./styles/profile.css";

function Profile({ userInfo, setUserInfo }) {
  const BaseURL = "http://127.0.0.1:8000/";
  const [formData, setFormData] = useState({
    email: userInfo?.user.email || "",
    username: userInfo?.user.username || "",
    first_name: userInfo?.user.first_name || "",
    last_name: userInfo?.user.last_name || "",
    password: '',
    profile_picture: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    for (let key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        `${BaseURL}edit_profile/${userInfo?.user?.id}/`,
        {
          method: "POST",
          body: submitData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const info = localStorage.getItem("userInfo");
        const parsed = JSON.parse(info);
        parsed.user = data.user;
        localStorage.setItem("userInfo", JSON.stringify(parsed));
        setUserInfo(parsed);
        console.log("Did update", userInfo);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      showForm(false);
    }
  };

  const showForm = (show) => {
    const form = document.querySelector(".EditProfileFormCont");
    if (show) {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
  };

  return (
    <div className="EverythingProf">
      <section className="profileCont">
        <div className="profile-card">
          <img
            alt="Profile Picture"
            src={
              userInfo?.user.profile_picture
                ? `${BaseURL}${userInfo.user.profile_picture}`
                : "https://generated-images.perchance.org/image/379575b777c491789998467c91d4740cb9f75efb04e66b4568dbae5e9b982762.jpeg"
              }
          />
          <h2>
            <b>Username:</b> {userInfo?.user?.username}
          </h2>
          <p>
            <b>Email:</b> {userInfo?.user?.email}
          </p>
          <p>
            <b>First Name:</b> {userInfo?.user?.first_name}
          </p>
          <p>
            <b>Last Name:</b> {userInfo?.user?.last_name}
          </p>
          <button className="Editbtn" onClick={() => showForm(true)}>
            Edit Profile
          </button>
        </div>
      </section>
      <aside className="ProfileFormCont">
        <section className="EditProfileFormCont">
          <aside className="Btn">
          <button className="btn" onClick={() => showForm(false)}>
            ❌
          </button>
          </aside>
          <form onSubmit={handleSubmit} className="EditProfForm">
            <label htmlFor="">Add Profile Pic</label>
            <div className="upload-button">
              <input
                type="file"
                accept="image/*"
                name="profile_picture"
                onChange={handleFileChange}
                className="UploadProfPicInput"
              />
              <img src="/images/plus.png" alt="" className="plus-icon" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="ProfUsername"
            />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="ProfFirst_name"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="ProfLast_name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="ProfEmail"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="ProfPassword"
            />
            <button type="submit" className="Savebtn">
              Save
            </button>
          </form>
        </section>
      </aside>
    </div>
  );
}

export default Profile;
