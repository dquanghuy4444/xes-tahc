import Skeleton from "@mui/material/Skeleton"

const SkeletonChatRoomCard = () => {
    return (
        <div className={ `flex p-2 rounded-md items-center` }>
            <Skeleton height={ 52 } variant="circular" width={ 52 } />

            <div className="ml-4 flex-1">
                <Skeleton sx={ {width: "50%"} } variant="text" />

                <Skeleton sx={ {width: "70%"} } variant="text" />
            </div>
        </div>
    )
}

export default SkeletonChatRoomCard
