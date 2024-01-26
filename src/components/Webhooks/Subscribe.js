import { useState } from "react";
import { notify } from "../../utils/notify";

function Subscribe() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form.
    // if (!username) {
    //   setusernameError("Username is required.");
    // }
    // if (!password) {
    //   setPasswordError("Password is required.");
    // }

    // If the form is valid, submit the subscribe request.
    if (sourceUrl && callbackUrl) {
      const res = await fetch("http://localhost:3000/webhooks/subscribe", {
        method: "POST",
        body: JSON.stringify({
          sourceUrl,
          callbackUrl,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.ok === true) {
        notify("Subscription successfull");
        setSourceUrl("");
        setCallbackUrl("");
      } else {
        const data = await res.json();
        notify(data.message, "error");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Source Url"
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
        />
        <input
          type="text"
          placeholder="Callback Url"
          value={callbackUrl}
          onChange={(event) => setCallbackUrl(event.target.value)}
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}
export default Subscribe;
