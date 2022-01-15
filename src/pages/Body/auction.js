import { React, useState } from "react";
import ReactPlayer from "react-player";

const auction = () => {
  const [play, setplay] = useState();
  return (
    <>
      <div>
        <input
          className="mt-1 border rounded p-3"
          value={play}
          type="text"
          placeholder="Description of NFT"
          onChange={(e) => setplay(e.target.value)}
          name="description"
          required
        />

        <ReactPlayer
          className="react-player"
          url="https://cdn.livepeer.com/hls/5e3fn0so1yfufzta/index.m3u8"
          playing
          width="100%"
          controls
          config={{
            file: {
              forceHLS: true,
            },
          }}
        />
      </div>
    </>
  );
};

export default auction;
