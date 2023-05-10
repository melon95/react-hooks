import { isBoolean } from "lodash-es";
import type { RefObject } from "react";
import { useState } from "react";
import screenfull from "screenfull";
import useUnmount from "../../lifeCycle/useUnmount";
import useLatest from "../../useLatest";
import useMemoizedFn from "../../useMemoizedFn";

export type BasicTarget =
	| HTMLElement
	| (() => HTMLElement)
	| RefObject<HTMLElement>
	| null;

interface PageFullscreen {
	className?: string;
	zIndex?: number;
}

export interface Options {
	onExit?: () => void;
	onEnter?: () => void;

	pageFullscreen?: boolean | PageFullscreen;
}

const DefaultClassName = "react-hooks-fullscreen";

const getFullscreen = () => screenfull.isFullscreen;
const getFullscreenEnabled = () => screenfull.isEnabled;
const getFullscreenElement = () => screenfull.element;

const getTargetElement = (target: BasicTarget): HTMLElement => {
	if (!target) return null;
	if (typeof target === "function") {
		return target();
	}
	if ("current" in target) {
		return target.current;
	}
	return target;
};

const useFullscreen = (target: BasicTarget, options: Options = {}) => {
	const [state, setState] = useState(false);
	const { onEnter, onExit, pageFullscreen = false } = options;
	const { className = DefaultClassName, zIndex = 9999 } =
		isBoolean(pageFullscreen) || !pageFullscreen ? {} : pageFullscreen;

	const onEnterCallback = useLatest(onEnter);
	const onExitCallback = useLatest(onExit);

	const invokeCallback = (isFullscreen: boolean) => {
		if (isFullscreen) {
			onEnterCallback.current?.();
		} else {
			onExitCallback.current?.();
		}
	};

	const onFullscreenChange = useMemoizedFn(() => {
		if (!getFullscreen()) {
			setState(false);
			invokeCallback(false);
			screenfull.off("change", onFullscreenChange);
		} else {
			const isFullscreen = getTargetElement(target) === getFullscreenElement();
			setState(isFullscreen);
			invokeCallback(isFullscreen);
		}
	});

	const togglePageFullscreen = (pageFullscreen: boolean) => {
		const styleElement = document.querySelector(`#${className}`);
		const el = getTargetElement(target);
		if (!el) return;
		if (pageFullscreen) {
			el.classList.add(className);
			if (!styleElement) {
				const style = document.createElement("style");
				style.id = className;
				style.textContent = `.${className} { position: fixed; top: 0; left: 0;right: 0;bottom: 0; width: 100% !important; height: 100%!important; z-index: ${zIndex}; }`;
				el.appendChild(style);
			}
		} else {
			el.classList.remove(className);
			if (styleElement) {
				styleElement.remove();
			}
		}
		if (state !== pageFullscreen) {
			invokeCallback(pageFullscreen);
			setState(pageFullscreen);
		}
	};

	const enterFullscreen = () => {
		const el = getTargetElement(target);
		if (!el) return;
		if (getFullscreenEnabled()) {
			if (pageFullscreen) {
				togglePageFullscreen(true);
				return;
			}
			screenfull.request(el);
			screenfull.on("change", onFullscreenChange);
		}
	};

	const exitFullscreen = () => {
		if (!getTargetElement(target)) return;
		if (getFullscreenEnabled()) {
			if (pageFullscreen) {
				togglePageFullscreen(false);
				return;
			}
			if (getFullscreenElement() === getTargetElement(target)) {
				screenfull.exit();
			}
		}
	};

	const toggleFullscreen = () => {
		if (!getTargetElement(target)) return;
		if (getFullscreenEnabled()) {
			if (state) {
				exitFullscreen();
			} else {
				enterFullscreen();
			}
		}
	};

	useUnmount(() => {
		if (getFullscreenEnabled() && !pageFullscreen) {
			screenfull.off("change", onFullscreenChange);
		}
	});

	return [
		state,
		{
			enterFullscreen: useMemoizedFn(enterFullscreen),
			exitFullscreen: useMemoizedFn(exitFullscreen),
			toggleFullscreen: useMemoizedFn(toggleFullscreen),
			isEnabled: getFullscreenEnabled(),
		},
	] as const;
};

export default useFullscreen;
