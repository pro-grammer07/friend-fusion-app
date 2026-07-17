import React, { useEffect, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import ConfirmDialog from "./ConfirmDialog";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NoProfile } from "../assets";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import {
  fetchPosts,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../utils";

const NOTIFICATION_MESSAGES = {
  like_post: "liked your post",
  comment_post: "commented on your post",
  like_comment: "liked your comment",
  reply_comment: "replied to your comment",
};

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  // eslint-disable-next-line
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    // eslint disable-next-line
    formState: { errors },
  } = useForm();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    const res = await getNotifications(user?.token);
    setNotifications(res || []);
  };

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) loadNotifications();
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationRead(user?.token, notification._id);
    setShowNotifications(false);
    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(user?.token);
    await loadNotifications();
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
          <TbSocial />
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          FriendFusion
        </span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem]  rounded-l-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className='hidden lg:flex relative'>
          <button
            onClick={toggleNotifications}
            className='relative'
            aria-label='Notifications'
          >
            <IoMdNotificationsOutline />
            {unreadCount > 0 && (
              <span className='absolute -top-1.5 -right-1.5 bg-[#f64949fe] text-white text-[10px] leading-none rounded-full px-1.5 py-0.5'>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className='absolute top-8 right-0 w-80 max-h-96 overflow-y-auto bg-primary shadow-xl rounded-lg border border-[#66666645] z-50 text-left'>
              <div className='flex items-center justify-between px-4 py-3 border-b border-[#66666645]'>
                <span className='font-medium text-ascent-1 text-base'>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    className='text-xs text-blue'
                    onClick={handleMarkAllRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    to={`/profile/${n.from?._id}`}
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex gap-3 items-center px-4 py-3 border-b border-[#66666645] last:border-0 hover:bg-[#0000000d] ${
                      n.read ? "" : "bg-[#0444a410]"
                    }`}
                  >
                    <img
                      src={n.from?.profileUrl ?? NoProfile}
                      alt={n.from?.firstName}
                      className='w-9 h-9 rounded-full object-cover shrink-0'
                    />
                    <div className='flex-1'>
                      <p className='text-sm text-ascent-1'>
                        <span className='font-medium'>
                          {n.from?.firstName} {n.from?.lastName}
                        </span>{" "}
                        {NOTIFICATION_MESSAGES[n.type] ?? "sent a notification"}
                      </p>
                      <span className='text-xs text-ascent-2'>
                        {moment(n.createdAt).fromNow()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className='text-sm text-ascent-2 text-center py-6'>
                  No notifications yet
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <CustomButton
            onClick={() => setShowLogoutConfirm(true)}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
      </div>

      <ConfirmDialog
        show={showLogoutConfirm}
        title='Log out'
        message='Are you sure you want to log out?'
        confirmLabel='Log Out'
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          dispatch(Logout());
        }}
      />
    </div>
  );
};

export default TopBar;