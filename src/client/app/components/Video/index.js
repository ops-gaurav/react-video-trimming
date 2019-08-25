// @flow
import * as React from 'react';
import FontAwsome from 'react-fontawesome';
import './index.scss';

export default () => {
	let xPoint = 0;
	let yPoint = 600;

	function drag(event) {
		event.dataTransfer.setData('id', event.target.id);
	};

	function drop(event) {
		event.preventDefault();
		const data = event.dataTransfer.getData('id');
		// console.log(data);
		// const vid = document.getElementById("video");
		const clickedPosition = event.pageX;
		const bounds = document.getElementById('marker').getBoundingClientRect();
		// console.log(clickedPosition - bounds.left);
		const componentPosition = clickedPosition - bounds.left;
		document.getElementById(data).style.marginLeft = `${componentPosition}px`;
	};
	return <div>
		<video
			id='video'
			onTimeUpdate={() => {
				const vid = document.getElementById("video");
				const percentage = (vid.currentTime / vid.duration) * 100;
				// console.log(percentage);
				document.getElementById('span').style.width = `${percentage}%`;
				// document.getElementById("marker").getElementById('span').css("width", percentage+"%");
			}}
			onSeeked={(seek) => console.log(seek.timeStamp)} width={600} height={300} controls>
			<source src='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' type='video/mp4' />
			Video not supported in this browser.
		  <section className='trim-overlay'>
				This is overlay
		  </section>
		</video>
		<section
			onDragOver={e => e.preventDefault()}
			onDrop={drop}
			className='marker' id='marker' >
			{/* <button className='btn btn-default float-btn' id='left-selector'><FontAwsome name='caret-left' /></button>
		  <button className='btn btn-default float-btn' id='right-selector'><FontAwsome name='caret-right' /></button> */}
			<span id='span'></span>
			<span
				draggable={true}
				className='selectors'
				style={{ marginLeft: `${xPoint}px`}}
				onDragStart={drag}
				id='xPoint'>
				<FontAwsome name='caret-left' />
			</span>
			<span
				draggable={true}
				className='selectors'
				style={{ marginLeft: `${yPoint}px`}}
				onDragStart={drag}
				id='yPoint'>
				<FontAwsome name='caret-right' />
			</span>
		</section>
	</div>;
}