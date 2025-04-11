import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const apiUrl = process.env.REACT_APP_API_URL;

export default function Shortener(props) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    function handleInputChange(e) {
        const { value } = e.target;
        setInput(value);
    }

    async function handleClick() {
        if (input === "") return;

        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/`, {
                method: "POST",
                body: JSON.stringify({ url: input }),
                headers: {
                    "Content-type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error shortening URL");
                setInput("");
                setLoading(false);
                return;
            }

            // 🟢 Robust logic to get shortId whether backend gives full URL or just ID
            const shortId =
                data.shortUrl?.split("/").pop() || data.shortId || data.id;

            const shortUrl = `${apiUrl}/${shortId}`;

            try {
                const analyticsRes = await fetch(`${apiUrl}/analytics/${shortId}`);
                const analyticsData = await analyticsRes.json();

                const newItem = {
                    url: input,
                    shortUrl,
                    clicks: analyticsData?.clickCount ?? 0,
                };

                props.addLink(newItem);
            } catch (err) {
                console.error("Analytics error:", err);
                const newItem = {
                    url: input,
                    shortUrl,
                    clicks: 0,
                };
                props.addLink(newItem);
            }

            setInput("");
            setLoading(false);
        } catch (err) {
            alert("Server Error");
            setInput("");
            setLoading(false);
        }
    }

    const override = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    return (
        <div className="shortener rounded-lg">
            <form>
                <div className="input-area">
                    <input
                        type="url"
                        placeholder="Shorten a link here..."
                        id="input"
                        onChange={handleInputChange}
                        value={input}
                    />
                    <p className="warning">Please add a link</p>
                </div>
                <button
                    className="btn-cta"
                    type="button"
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? (
                        <PulseLoader
                            color={"white"}
                            cssOverride={override}
                            size={11}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    ) : (
                        "Shorten it!"
                    )}
                </button>
            </form>
        </div>
    );
}
