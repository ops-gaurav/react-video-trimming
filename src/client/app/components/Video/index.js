// @flow
import * as React from 'react';
import moment from 'moment';
import FontAwsome from 'react-fontawesome';
import axios from 'axios';
import './index.scss';

export default () => {
	let xPoint = 0;
	let yPoint = 570;

	const trimLimits = {
		xPoint: 0,
		yPoint: 0,
		timeDiff: 0,
	}

	/**
	 * trigger the trim video
	 */
	function triggerTrim() {
		axios.post('http://localhost:3001/api/users/trim', trimLimits)
			.then(success => {
				const { data: { data, message }} = success;
				console.log(data, message);
				if (data) {
					document.getElementById('download-link').style.display = 'block';
					document.getElementById('download-link').innerHTML = `download ${data}.mp4`;
					document.getElementById('download-link').onclick = () => {
						window.open(`http://localhost:3001/api/users/download/${data}`, '_blank');
						// document.getElementById('download-link').style.display = 'none';
					}
				}
			}).catch(err => alert('Some error while sending trim request. Is Server running?'));
	}

	// download the trimmed video
	function download() {
		
	}

	function drag(event) {
		event.dataTransfer.setData('id', event.target.id);
	};

	function fancyTimeFormat(time) {
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = ~~time % 60;

		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";

		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}

		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}

	function drop(event) {
		event.preventDefault();
		const data = event.dataTransfer.getData('id');
		// console.log(data);
		const vid = document.getElementById("video");
		const division = (vid.duration / document.getElementById('marker').clientWidth);
		const clickedPosition = event.pageX;
		const bounds = document.getElementById('marker').getBoundingClientRect();
		// console.log(clickedPosition - bounds.left);
		const componentPosition = clickedPosition - bounds.left;
		const time = componentPosition * division;
		// console.log(fancyTimeFormat(time));
		trimLimits[data] = fancyTimeFormat(time);
		const t1 = moment(trimLimits.xPoint, 'mm:ss')
		const t2 = moment(trimLimits.yPoint, 'mm:ss')
		trimLimits.timeDiff = moment.duration(t2.diff(t1)).asSeconds();
		document.getElementById(`${data}Value`).innerHTML = trimLimits[data];
		console.log(trimLimits);
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
			<source src='https://ia800701.us.archive.org/26/items/SampleVideo1280x7205mb/SampleVideo_1280x720_5mb.mp4' type='video/mp4' />
			Video not supported in this browser.
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
				style={{ marginLeft: `${xPoint}px` }}
				onDragStart={drag}
				id='xPoint'>
				<FontAwsome name='caret-left' />&nbsp;&nbsp;<span className='time' id='xPointValue'>{trimLimits.xPoint}</span>
			</span>
			<span
				draggable={true}
				className='selectors'
				style={{ marginLeft: `${yPoint}px` }}
				onDragStart={drag}
				id='yPoint'>
				<FontAwsome name='caret-right' />&nbsp;&nbsp;<span className='time' id='yPointValue'>&nbsp;{trimLimits.yPoint}</span>
			</span>
		</section>
		<br/>
		<button onClick={triggerTrim} className='btn btn-primary'>Trim</button><br/>
		<button id='download-link' className='btn btn-link'>Download</button>
	</div>;
}