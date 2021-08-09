const MessageStatusIcon = ({ status }) => {
  if (status === 'seen') {
    return <span className='seen-status'>&#x2713;&#x2713;</span>;
  } else if (status === 'delivered') {
    return <span className='delivered-status'>&#x2713;&#x2713;</span>;
  }
  return <span className='sent-status'>&#x2713;</span>;
};

export default MessageStatusIcon;
