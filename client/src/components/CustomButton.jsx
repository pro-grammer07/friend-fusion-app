
const CustomButton = ({ title, containerStyles, iconRight, type, onClick, disabled }) => {
    return (
      <button
        onClick={onClick}
        type={type || "button"}
        disabled={disabled}
        className={`inline-flex items-center text-base ${containerStyles} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {title}

        {iconRight && <div className='ml-2'>{iconRight}</div>}
      </button>
    );
  };

  export default CustomButton;