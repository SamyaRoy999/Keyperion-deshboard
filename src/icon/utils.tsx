import FavIcon, { IconName } from "./favIcon";

export const getSocial = (name: string) => {
  const socialMap: { [key: string]: string } = {
    facebook: "facebook",
    twitter: "twitter",
    instagram: "instagram",
    tiktok: "tiktok",
    youtube: "youtube",
  };

  return socialMap[name] ? (
    <FavIcon className="size-5" name={socialMap[name] as IconName} />
  ) : null;
};
