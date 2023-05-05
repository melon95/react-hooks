import { useEffect } from "react";

const ImgTypeMap = {
	SVG: "image/svg+xml",
	ICO: "image/x-icon",
	GIF: "image/gif",
	PNG: "image/png",
};

type ImgTypes = keyof typeof ImgTypeMap;

const useFavicon = (href: string) => {
	useEffect(() => {
		if (!href) return;
		const suffix = href.split(".").pop()?.toUpperCase() as ImgTypes;
		const link: HTMLLinkElement =
			document.querySelector("link[rel*='icon']") ||
			document.createElement("link");

		link.href = href;
		link.rel = "shortcut icon";
		link.type = ImgTypeMap[suffix];

		document.head.appendChild(link);
	}, [href]);
};

export default useFavicon;
