import React from 'react';
import './notification-toast.component.scss';

const NotificationToastComponent = ({message}: { message: string }) => {
	return (
		<div className="notification-toast__component position-fixed bottom-0 end-0 p-3">
			<div id="liveToast" className="toast" style={{display: "block"}} role="alert" aria-live="assertive"
				 aria-atomic="true">
				<div className="toast-header">
					<strong className="me-auto">Spliwise</strong>
					{/*<button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"/>*/}
				</div>
				<div className="toast-body">
					{message}
				</div>
			</div>
		</div>
	);
};

export default NotificationToastComponent;
