import CloseButton from 'react-bootstrap/CloseButton';

export default function CalcCellHeader({ ...props }) {
	return (
		<div className="d-flex justify-content-between">
			{/* Operation */}
			<div className="fs-5">
				{props.cellIdx === props.cage.anchor
					? `${props.cage.value || ' '}${props.cage.op || ' '}`
					: String.fromCharCode(160)}
			</div>

			{/* Undo button only visible when answer has been entered*/}
			{props.answered && <CloseButton onClick={props.handleRemoveAnswer} />}
		</div>
	);
}
