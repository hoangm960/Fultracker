export const InfoField = ({ title, total }) => {
	return (
		<div
			className="pr-5 pl-5 flex flex-row gap-2.5 items-center justify-start"
		>
			<div
				className="text-text text-left relative font-semibold text-lg"
			>
				{title}
			</div>

			<div className="flex flex-row gap-0 items-center justify-start shrink-0 relative">
				<div
					className="text-action text-left relative font-semibold text-lg"
				>
					0
				</div>

				<div
					className="text-text text-left relative font-semibold text-lg"
				>
					/{total}
				</div>
			</div>
		</div>
	)
}
