import { useEffect, useState } from "react";

enum Type {
	js = "js",
	css = "css",
}

type ScriptAttrs = Partial<HTMLScriptElement>;
type LinkAttrs = Partial<HTMLLinkElement>;

interface JSOptions {
	type: Type.js;
	js?: ScriptAttrs;
}

interface CSSOptions {
	type: Type.css;
	css?: LinkAttrs;
}

interface DefaultOptions {
	type?: never;
	js?: ScriptAttrs;
	css?: LinkAttrs;
}

export type Options = JSOptions | CSSOptions | DefaultOptions;

enum Status {
	unset = "unset",
	loading = "loading",
	ready = "ready",
	error = "error",
}

interface CreateResult {
	ref: HTMLScriptElement | HTMLLinkElement;
	status: Status;
}

const parseTypeFromPath = (path: string) => {
	const lastDot = path.lastIndexOf(".");
	const type = path.substring(lastDot + 1);
	return type as Options["type"];
};

const createDomByType = (
	type: Options["type"],
	path: string,
	options: Options,
): CreateResult => {
	switch (type) {
		case Type.js:
			return createScript(path, (options as JSOptions).js);
		case Type.css:
			return createLink(path, (options as CSSOptions).css);
		default:
			console.error(`only support js and css, but got ${type}`);
		// throw new Error("only support js and css");
	}
};

const createScript = (
	path: string,
	options: JSOptions["js"] = {},
): CreateResult => {
	const existingScript: HTMLScriptElement = document.querySelector(
		`script[src="${path}"]`,
	);
	if (existingScript) {
		return {
			ref: existingScript,
			status:
				(existingScript.getAttribute("data-status") as Status) || Status.ready,
		};
	}

	const script = document.createElement("script") as any;
	script.src = path;
	Object.keys(options).forEach((key) => {
		script[key] = (options as any)[key];
	});
	script.setAttribute("data-status", Status.loading);

	document.body.appendChild(script);
	return {
		ref: script as HTMLScriptElement,
		status: Status.loading,
	};
};

const createLink = (
	path: string,
	options: CSSOptions["css"] = {},
): CreateResult => {
	const existingLink: HTMLLinkElement = document.querySelector(
		`link[href="${path}"]`,
	);
	if (existingLink) {
		return {
			ref: existingLink,
			status:
				(existingLink.getAttribute("data-status") as Status) || Status.ready,
		};
	}

	const link = document.createElement("link") as any;

	link.ref = "stylesheet";
	link.href = path;
	Object.keys(options).forEach((key) => {
		link[key] = (options as any)[key];
	});

	// IE9+
	const isLegacyIECss = "hideFocus" in link;
	// use preload in IE Edge (to detect load errors)
	if (isLegacyIECss && link.relList) {
		link.rel = "preload";
		link.as = "style";
	}

	link.setAttribute("data-status", Status.loading);

	document.head.appendChild(link);
	return {
		ref: link as HTMLLinkElement,
		status: Status.loading,
	};
};

const useExternal = (path: string, options: Options = {}) => {
	const [status, setStatus] = useState<Status>(
		path ? Status.loading : Status.unset,
	);

	useEffect(() => {
		if (!path) return;
		const { type = parseTypeFromPath(path) } = options;
		const domResult = createDomByType(type, path, options);
		if (!domResult) return;
		const { ref, status } = domResult;
		setStatus(status);

		ref.onload = () => {
			ref.setAttribute("data-status", Status.ready);
			setStatus(Status.ready);
		};
		ref.onerror = () => {
			ref.setAttribute("data-status", Status.error);
			setStatus(Status.error);
		};
		return () => {
			ref.remove();
		};
	}, [path]);

	return status;
};

export default useExternal;
