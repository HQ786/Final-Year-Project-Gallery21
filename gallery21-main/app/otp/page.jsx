'use client'
import { OtpModal } from "@components/OtpModal"

const page = ({savedEmail, userId, isOpen, onClose}) => {
    const onClose = () => {

    };
  return (
    <div>
      <OtpModal savedEmail={savedEmail} userId={userId} isOpen={isOpen} onClose = {onClose} />
    </div>
  )
}

export default page
//savedEmail, userId, isOpen, onClose