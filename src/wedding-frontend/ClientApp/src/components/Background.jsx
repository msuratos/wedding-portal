import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import './Background.css';

// this component is copied from https://codepen.io/spite/pen/DgQzLv?editors=1000
// and from https://codepen.io/Srcko85/pen/MVKpey?editors=1100
const Background = () => {
	const viewport = useRef();
	const world = useRef();
	const star = useRef();

	const layers = useMemo(() => [],[]);

	const init = () => {
		let lastTime = 0;
		const vendors = ['ms', 'moz', 'webkit', 'o'];

		for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = (callback, element) => {
				const currTime = new Date().getTime();
				const timeToCall = Math.max(0, 16 - (currTime - lastTime));
				const id = window.setTimeout(
					() => { callback(currTime + timeToCall); },
					timeToCall
				);

				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = (id) => {
				clearTimeout(id);
			};
		}
	};

	const createStar = () => {
		const div = document.createElement('div');
		div.className = 'star';

		const t = `${Math.round(Math.random() * 2) === 1 ? 'pulse1' : 'pulse2'} ${Math.random() * 3}s linear infinite`;
		div.style.webkitAnimation =
			div.style.MozAnimation =
			div.style.msAnimation =
			div.style.oAnimation =
			div.style.animation = t;

		div.style.top = `${Math.round(Math.random() * 100)}%`;
		div.style.left = `${Math.round(Math.random() * 100)}%`;
		div.style.width = div.style.height = `${Math.random() * 5}px`;

		star.current.appendChild(div);
	};

	const createCloud = useCallback(() => {
		const div = document.createElement('div');
		div.className = 'cloudBase';

		let x = 256 - (Math.random() * 512);
		let y = 256 - (Math.random() * 512);
		let z = 256 - (Math.random() * 512);
		const t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';

		div.style.webkitTransform =
			div.style.MozTransform =
			div.style.msTransform =
			div.style.oTransform =
			div.style.transform = t;

		world.current.appendChild(div);

		for (let j = 0; j < 5 + Math.round(Math.random() * 10); j++) {
			const cloud = document.createElement('div');
			cloud.style.opacity = 0;
			cloud.style.opacity = .8;
			cloud.className = 'cloudLayer';

			let x = 256 - (Math.random() * 512);
			let y = 256 - (Math.random() * 512);
			let z = 100 - (Math.random() * 200);
			let a = Math.random() * 360;
			let s = .25 + Math.random();

			x *= .2; y *= .2;

			cloud.data = {
				x: x,
				y: y,
				z: z,
				a: a,
				s: s,
				speed: .1 * Math.random()
			};

			const t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
			cloud.style.webkitTransform =
				cloud.style.MozTransform =
				cloud.style.msTransform =
				cloud.style.oTransform =
				cloud.style.transform = t;

			div.appendChild(cloud);
			layers.push(cloud);
		}

		return div;
	}, [layers]);

	const generate = useCallback(() => {
		let objects = [];
		objects = [];

		if (world.current.hasChildNodes()) {
			while (world.current.childNodes.length >= 1) {
				world.current.removeChild(world.current.firstChild);
			}
		}

		for (let j = 0; j < 5; j++) {
			objects.push(createCloud());
		}

		for (let k = 0; k < Math.round(Math.random() * 20); k++) {
			createStar();
    }
	}, [createCloud]);

	const update = useCallback(() => {
		let worldXAngle = 0;
		let worldYAngle = 0;

		for (let j = 0; j < layers.length; j++) {
			const layer = layers[j];
			layer.data.a += layer.data.speed;

			const t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + (- worldYAngle) + 'deg ) rotateX( ' + (- worldXAngle) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
			layer.style.webkitTransform =
				layer.style.MozTransform =
				layer.style.msTranform =
				layer.style.oTransform =
				layer.style.transform = t;
		}

		requestAnimationFrame(update);
	}, [layers]);

	useEffect(() => {
		let p = 400;

		viewport.current.style.webkitPerspective = p;
		viewport.current.style.MozPerspective = p;
		viewport.current.style.oPerspective = p;

		init();
		generate();
		update();
  }, [viewport, world, star, generate, update]);

	return (
		<div ref={viewport} className="viewport">
			<div ref={world} className="world"></div>
			<div ref={star} className="star-container"></div>
    </div>
  );
};

export default Background;