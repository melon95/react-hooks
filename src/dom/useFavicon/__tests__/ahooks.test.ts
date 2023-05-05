import { renderHook } from "@testing-library/react";
import useFavicon from "../index";

describe("useFavicon", () => {
	it("should set the favicon", () => {
		expect(document.querySelector("link[rel*='icon']")).toBeNull();
		renderHook(() => useFavicon("favicon.ico"));
		expect(document.querySelector("link[rel*='icon']")).not.toBeNull();
	});

	it("should support svg/png/ico/gif", () => {
		const { rerender } = renderHook((url: string) => useFavicon(url));
		const suffixs = ["svg", "png", "ico", "gif"] as const;
		const imgTypeMap = {
			svg: "image/svg+xml",
			ico: "image/x-icon",
			gif: "image/gif",
			png: "image/png",
		};
		suffixs.forEach((suffix) => {
			const url = `http://localhost/favicon.${suffix}`;
			rerender(url);
			const link = document.querySelector(
				"link[rel*='icon']",
			) as HTMLLinkElement;
			expect(link.type).toEqual(imgTypeMap[suffix]);
			expect(link.href).toEqual(url);
			expect(link.rel).toEqual("shortcut icon");
		});
	});
});
