import { FiFileText } from "react-icons/fi";
import s from "./profileDesign";

export default function ProfilesPlaceholder() {
	return (
		<div className={s.placeholderWrap}>
			<div className={s.placeholderIconWrap}>
				<FiFileText size={48} />
			</div>
			<h2 className={s.placeholderTitle}>Profile Management</h2>
			<p className={s.placeholderText}>
				Select an option from the left sidebar to manage profiles
			</p>
		</div>
	);
}
