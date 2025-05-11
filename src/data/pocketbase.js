import PocketBase from "pocketbase";

const pb = new PocketBase("https://web-ar-pocketbase.fly.dev");

pb.beforeSend = (url, options) => {
  options.headers["token"] = "W!b#J50$tAG3Pmh&PSUy2WsIO4FTPUqsR4";
  return { url, options };
};

export default pb;
