import React from "react";

const Notification = ({ notification, delNotification }) => (
  <div className="NotificationCont">
    <div>
      <div className="NotificationHeader">
        <h2 className="NotificationTitle">
          {notification?.task ? "Task is almost due" : "Notification"}
        </h2>
        <span>{notification?.created_at.split("T")[0]}</span>
      </div>
      <div className="NotificationMessageAndBtnCont">
        <p className="NotificationMessage">{notification.message}</p>
        <button
          onClick={() => delNotification(notification.user, notification.id)}
        >
          Delete
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
