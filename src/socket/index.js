io.on('connection', (socket) => {
    //socket.on => when we have to take something from other side of
    //socket.emit => when we have to send something to other side

    socket.on('new-user-add', async (newUserId) => {
        // if user is not added previously
        const userIndex = activeUsers.findIndex(user => user.userId === newUserId);
        if (userIndex === -1) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });

            await Chat.update(
                {
                    messageStatus: "deliver",
                },
                {
                    where: {
                        receiverId: newUserId,
                        messageStatus: 'sent'
                    }
                }
            );

            // const buyNFTData = await BuyNFT.findAll({
            //     where: {
            //         owner_id: newUserId,
            //         isPromptRead: false
            //     },
            //     order: [["id", "desc"]],
            // })

            // if (buyNFTData.length > 0) {
            //     let latestNFTData = await ArtistNFT.findOne({
            //         where: {
            //             id: buyNFTData[0].nft_id
            //         },
            //         order: [["id", "desc"]]
            //     })

            //     latestNFTData.dataValues.buyNFTId = buyNFTData[0].id
            //     latestNFTData.dataValues.totalBuyNFTCount = buyNFTData.length

            //     io.to(socket.id).emit(
            //         "buy-nft-prompt",
            //         latestNFTData,
            //     );
            // }

        } else {
            // Update the socketId if the user is already in the array
            activeUsers[userIndex].socketId = socket.id;
        }

        io.emit('get-users', activeUsers)
    })

    //someone is disconnect from server
    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    })
});

