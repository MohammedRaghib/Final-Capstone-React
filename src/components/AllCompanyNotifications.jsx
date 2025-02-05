import React from "react";

const Notification = ({ notification, delNotification }) => (
  <div className="NotificationCont">
    <div>
      <h2 className="NotificationTitle">
        {notification?.task ? "Task is almost due" : "Invite update"}
      </h2>
      <div className="NotificationMessageAndBtnCont">
        <p className="NotificationMessage">{notification.message}</p>
        <button
          onClick={() => delNotification(notification.user, notification.id)}
        >
          Mark as read
        </button>
      </div>
    </div>
  </div>
);

const AllCompNotificationsCont = ({ CompanyInfo, delNotification }) => {
  const filteredNotifications = CompanyInfo?.notifications?.filter(
    (notification) => notification.message !== "Invite"
  );

  return (
    <section className="AllCompNotificationsCont">
      <div className="AllNotifications">
        {filteredNotifications?.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              delNotification={delNotification}
            />
          ))
        ) : (
          <p className="NoNotifications">No notifications</p>
        )}
      </div>
    </section>
  );
};

export default AllCompNotificationsCont;
