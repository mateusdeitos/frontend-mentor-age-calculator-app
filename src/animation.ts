
export const animateOpacity = (element: Element | null, onFinishAnimation = () => {}) => {
	if (!element) return;
	element.classList.add("animate-opacity");
	setTimeout(() => {
		element.classList.remove("animate-opacity");
		onFinishAnimation();
	}, 300);
}