import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
// import { suggest, requests } from "../assets/data";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { apiRequest, handleFileUpload, fetchPosts, likePost, deletePost, sendFriendRequest, getUserInfo } from "../utils";
import { UpdateProfile, UserLogin } from "../redux/userSlice";
import { ClearSearch } from "../redux/searchSlice";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector(state => state.posts);
  const { term: searchTerm, people: searchPeople } = useSelector((state) => state.search);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const description = watch("description");
  const canPost = !!description?.trim() || attachments.length > 0;

  const addAttachments = (fileList, kind) => {
    const newItems = Array.from(fileList).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      kind,
    }));
    setAttachments((prev) => [...prev, ...newItems]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  };

  const clearAttachments = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
    setAttachments([]);
  };

  const handlePostSubmit = async (data) => {
    if (!canPost) {
      setErrMsg({
        status: "failed",
        message: "Write something or attach a photo/video to post",
      });
      return;
    }

    setPosting(true);
    setErrMsg("");

    try {
      const uploads = await Promise.all(
        attachments.map(async (a) => {
          const uploaded = await handleFileUpload(a.file);
          return uploaded && { url: uploaded.url, type: a.kind };
        })
      );

      const media = uploads.filter(Boolean);

      const newData = media.length > 0 ? { ...data, media } : data;
      const res = await apiRequest({
            url: "/posts/create-post",
            data: newData,
            token: user?.token,
            method: "POST",
      });

        console.log(res);
        if(res?.status === "failed") {
          setErrMsg(res);
        } else {
          reset({
            description: "",
          });
          clearAttachments();
          setErrMsg("");
          await fetchPost();

        }
        setPosting(false);


    } catch (error) {
      console.log(error);
    setPosting(false);

    }
  };

    const fetchPost = async () => {
      await fetchPosts(user?.token, dispatch);

      setLoading(false);

    };


    const handleLikePost = async (uri) => {
      await likePost({ uri: uri, token: user?.token });

      await fetchPost();
    };

    const handleDelete = async (id) => {
      await deletePost(id, user.token);
      await fetchPost();
    };

    const handleClearSearch = async () => {
      dispatch(ClearSearch());
      await fetchPost();
    };

    const fetchFriendRequests = async () => {
      try {
            const res = await apiRequest({
            url: "/users/get-friend-request", 
            token: user?.token, 
            method: "POST", 
            });

            setFriendRequest(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSuggestedFriends = async () => {
            try {
            const res = await apiRequest({
            url: "/users/suggested-friends", 
            token: user?.token, 
            method: "POST", 
            });

            setSuggestedFriends(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    const handleFriendRequest = async (id) => {
      try {
        const res = await sendFriendRequest(user.token, id);
        await fetchSuggestedFriends();
      } catch (error) {
        
      }
    };


    const acceptFriendRequest = async (id, status) => {
                  try {
            const res = await apiRequest({
            url: "/users/accept-request", 
            token: user?.token, 
            method: "POST", 
            data: { rid: id, status },
            });

            setFriendRequest(res?.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getUser = async () => {
      const res = await getUserInfo(user?.token);
      if (res) {
        const newData = { ...user, ...res, token: user?.token };
        dispatch(UserLogin(newData));
      }
    };

    useEffect(() => {
      setLoading(true);
      getUser();
      fetchPost();
      fetchFriendRequests();
      fetchSuggestedFriends();
      UpdateProfile();
    }, []);
 


  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            {searchTerm && (
              <div className='flex items-center justify-between'>
                <p className='text-ascent-1 text-lg font-semibold'>
                  Results for &quot;{searchTerm}&quot;
                </p>
                <button
                  type='button'
                  className='text-sm text-blue'
                  onClick={handleClearSearch}
                >
                  Clear
                </button>
              </div>
            )}

            {searchTerm && (
              <div className='flex flex-col gap-3'>
                <p className='text-ascent-2 font-medium'>People</p>
                {searchPeople?.length > 0 ? (
                  searchPeople.map((person) => (
                    <Link
                      to={"/profile/" + person?._id}
                      key={person?._id}
                      className='w-full flex gap-4 items-center bg-primary p-3 rounded-lg'
                    >
                      <img
                        src={person?.profileUrl ?? NoProfile}
                        alt={person?.firstName}
                        className='w-12 h-12 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {person?.firstName} {person?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {person?.profession ?? ""}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className='text-sm text-ascent-2'>No people found</p>
                )}

                <p className='text-ascent-2 font-medium mt-2'>Posts</p>
              </div>
            )}

            {!searchTerm && (
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt='UserImage'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register("description")}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              {attachments.length > 0 && (
                <div className='w-full grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4'>
                  {attachments.map((a) => (
                    <div key={a.id} className='relative aspect-square'>
                      {a.kind === "video" ? (
                        <video
                          src={a.previewUrl}
                          muted
                          className='w-full h-full object-cover rounded-lg'
                        />
                      ) : (
                        <img
                          src={a.previewUrl}
                          alt='attachment preview'
                          className='w-full h-full object-cover rounded-lg'
                        />
                      )}
                      <button
                        type='button'
                        onClick={() => removeAttachment(a.id)}
                        className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 leading-none'
                        aria-label='Remove attachment'
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className='flex items-center justify-between py-4'>
                <label
                  htmlFor='imgUpload'
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input
                    type='file'
                    multiple
                    onChange={(e) => {
                      addAttachments(e.target.files, "image");
                      e.target.value = "";
                    }}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    multiple
                    data-max-size='5120'
                    onChange={(e) => {
                      addAttachments(e.target.files, "video");
                      e.target.value = "";
                    }}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='vgifUpload'
                >
                  <input
                    type='file'
                    multiple
                    data-max-size='5120'
                    onChange={(e) => {
                      addAttachments(e.target.files, "gif");
                      e.target.value = "";
                    }}
                    className='hidden'
                    id='vgifUpload'
                    accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type='submit'
                      title='Post'
                      disabled={!canPost}
                      containerStyles={`py-1 px-6 rounded-full font-semibold text-sm ${
                        canPost
                          ? "bg-[#0444a4] text-white"
                          : "bg-[#66666645] text-ascent-2"
                      }`}
                    />
                  )}
                </div>
              </div>
            </form>
            )}

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length ?? 0}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={"/profile/" + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <CustomButton
                        title='Deny'
                        onClick={() => acceptFriendRequest(_id, "Denied")}
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
                <span>{suggestedFriends?.length ?? 0}</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.map((friend) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => handleFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;