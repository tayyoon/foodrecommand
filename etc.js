// 참여버튼
router.get('/postPush/:roomId', authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { user } = res.locals;
    const { userId } = user;

    try {
        await Post.updateOne(
            { roomId: roomId },
            { $push: { nowMember: [userId] } }
        );
        await Room.updateOne(
            { roomId: roomId },
            { $push: { nowMember: [userId] } }
        );
        await Myex.create({
            userId,
            roomId,
        });
        var postInfo = await Post.findOne({ roomId });
        const userInfo = await User.findOne({
            userId: postInfo.userId,
        });
        postInfo['nickName'] = `${userInfo.nickName}`;
        postInfo['userAge'] = `${userInfo.userAge}`;
        postInfo['userGender'] = `${userInfo.userGender}`;
        postInfo['userImg'] = `${userInfo.userImg}`;

        let nowmemberId = [];
        let nowMember = '';
        for (let i = 0; i < postInfo.nowMember.length; i++) {
            nowmemberId.push(postInfo.nowMember[i]);
        }
        postInfo['nowMember'] = [];
        for (let i = 0; i < nowmemberId.length; i++) {
            nowMember = await User.findOne({
                userId: nowmemberId[i],
            });
            nowInfo = {
                memberId: nowMember.userId,
                memberImg: nowMember.userImg,
                memberNickname: nowMember.nickName,
                memberAgee: nowMember.userAge,
                memberGen: nowMember.userGender,
                memberDesc: nowMember.userContent,
                memberLevel: nowMember.level,
                memberCategory: nowMember.userInterest,
            };
            postInfo['nowMember'].push(nowInfo);
        }
        res.status(200).send({ msg: '성공', postInfo });
    } catch (error) {
        res.status(401).send({ msg: '참여 실패!' });
    }
});

// 참여 취소
router.get('/postPushCancle/:roomId', authMiddleware, async (req, res) => {
    const { roomId } = req.params;
    const { user } = res.locals;
    const { userId } = user;
    try {
        await Post.updateOne(
            { roomId },
            { $pullAll: { nowMember: [[userId]] } }
        );
        await Room.updateOne(
            { roomId },
            { $pullAll: { nowMember: [[userId]] } }
        );
        await Myex.deleteOne({
            userId,
            roomId,
        });
        var postInfo = await Post.findOne({ roomId });
        const userInfo = await User.findOne({
            userId: postInfo.userId,
        });
        postInfo['nickName'] = `${userInfo.nickName}`;
        postInfo['userAge'] = `${userInfo.userAge}`;
        postInfo['userGender'] = `${userInfo.userGender}`;
        postInfo['userImg'] = `${userInfo.userImg}`;

        let nowmemberId = [];
        let nowMember = '';
        for (let i = 0; i < postInfo.nowMember.length; i++) {
            nowmemberId.push(postInfo.nowMember[i]);
        }
        postInfo['nowMember'] = [];
        for (let i = 0; i < nowmemberId.length; i++) {
            nowMember = await User.findOne({
                userId: nowmemberId[i],
            });
            nowInfo = {
                memberId: nowMember.userId,
                memberImg: nowMember.userImg,
                memberNickname: nowMember.nickName,
                memberAgee: nowMember.userAge,
                memberGen: nowMember.userGender,
                memberDesc: nowMember.userContent,
                memberLevel: nowMember.level,
                memberCategory: nowMember.userInterest,
            };
            postInfo['nowMember'].push(nowInfo);
        }
        res.status(200).send({ msg: '취소완료!', postInfo });
    } catch (error) {
        console.error(error);
        res.status(401).send({ msg: '취소 실패' });
    }
});

// 모집완료
router.get('/complete/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.updateOne(
            { _id: postId },
            { $set: { status: false } }
        );
        res.status(200).send({ msg: '모집완료!', post });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: '모집 미완료' });
    }
});

// 아마도 채팅방 생성
const uuid = () => {
    const tokens = v4().split('-');
    return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};
const roomId = uuid();

// 전체 리스트 무한스크롤
router.get('/wholePostList/:pageNumber', authMiddleware, async (req, res) => {
    const { pageNumber } = req.params;

    try {
        var wholePosts = await Post.find({})
            .sort({ $natural: -1 })
            .skip((pageNumber - 1) * 6)
            .limit(6);

        let userInfo = '';
        for (let i = 0; i < wholePosts.length; i++) {
            userInfo = await User.findOne({
                userId: wholePosts[i].userId,
            });
            wholePosts[i]['nickName'] = `${userInfo.nickName}`;
            wholePosts[i]['userAge'] = `${userInfo.userAge}`;
            wholePosts[i]['userGender'] = `${userInfo.userGender}`;
            wholePosts[i]['userImg'] = `${userInfo.userImg}`;
            wholePosts[i]['level'] = `${userInfo.level}`;
            let nowmemberId = [];
            let nowMember = '';
            for (let j = 0; j < wholePosts[i].nowMember.length; j++) {
                nowmemberId.push(wholePosts[i].nowMember[j]);
            }
            wholePosts[i]['nowMember'] = [];
            for (let j = 0; j < nowmemberId.length; j++) {
                nowMember = await User.findOne({
                    userId: nowmemberId[j],
                });
                nowInfo = {
                    memberId: nowMember.userId,
                    memberImg: nowMember.userImg,
                    memberNickname: nowMember.nickName,
                    memberAgee: nowMember.userAge,
                    memberGen: nowMember.userGender,
                    memberDesc: nowMember.userContent,
                    memberLevel: nowMember.level,
                    memberCategory: nowMember.userInterest,
                };
                wholePosts[i]['nowMember'].push(nowInfo);
            }
        }

        res.status(200).json({ wholePosts });
    } catch (err) {
        console.log(err);
        res.status(400).send('전체 포스트 오류');
    }
});

// 전체(메인)게시글 조회
router.get('/communityList', authMiddleware, async (req, res, next) => {
    const { user } = res.locals;
    const { userId, address } = user;
    const categoryPost = [];

    // 카테고리 등록한것중에서 최신순 6개 (카테고리 구분없이 전체로)
    try {
        const totalList = await Post.find({ address });
        const likeThing = await User.find({ userId }, { userInterest: 1 });

        for (let i = 0; i < likeThing[0].userInterest.length; i++) {
            // 관심카테고리에 있는 카테고리들을 반복문으로 돌려서 토탈리스트의 카테고리 값과 동일한것이 있으면 토탈리스트의 포스트 아이디를 담는다.
            for (let j = 0; j < totalList.length; j++) {
                if (
                    likeThing[0].userInterest[i] === totalList[j].postCategory
                ) {
                    var likeThingsPost = await Post.findOne({
                        _id: totalList[j]._id,
                    });
                    const userInfo = await User.findOne({
                        userId: likeThingsPost.userId,
                    });
                    likeThingsPost['nickName'] = `${userInfo.nickName}`;
                    likeThingsPost['userAge'] = `${userInfo.userAge}`;
                    likeThingsPost['userGender'] = `${userInfo.userGender}`;
                    likeThingsPost['userImg'] = `${userInfo.userImg}`;

                    categoryPost.push(likeThingsPost);
                }
            }
        }
        // 최신순으로 정렬해주기 위해 a,b로 하나씩 빼서 두개를 비교해가며 정렬 후 원하는 갯수만큼 slice
        const caPost = categoryPost
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);

        // 작성된 전체 리뷰 최신순으로 넘기기
        var filterReview = [];
        var allReviews = await Review.find({}).sort({ $natural: -1 });
        for (let i = 0; i < allReviews.length; i++) {
            if (allReviews[i].reviewImg) {
                const userInfo = await User.findOne({
                    userId: allReviews[i].userId,
                });
                allReviews[i]['nickName'] = `${userInfo.nickName}`;
                allReviews[i]['userAge'] = `${userInfo.userAge}`;
                allReviews[i]['userImg'] = `${userInfo.userImg}`;
                filterReview.push(allReviews[i]);
            }
        }

        const filterRe = filterReview
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8);

        var newNearByPosts = await Post.find({ address }).sort({
            $natural: -1,
        });
        //미리 유저 아이디 저장
        let nowmemberId2 = [];
        for (let i = 0; i < newNearByPosts.length; i++) {
            let nowmemberId = [];
            for (let j = 0; j < newNearByPosts[i].nowMember.length; j++) {
                nowmemberId.push(newNearByPosts[i].nowMember[j]);
            }
            nowmemberId2.push(nowmemberId);
        }

        var userInfo = '';
        var nowInfo = '';
        var nowMember = '';
        for (let i = 0; i < nowmemberId2.length; i++) {
            userInfo = await User.findOne({
                userId: newNearByPosts[i].userId,
            });
            newNearByPosts[i]['nowMember'] = [];
            for (let j = 0; j < nowmemberId2[i].length; j++) {
                nowMember = await User.findOne({
                    userId: nowmemberId2[i][j],
                });
                nowInfo = {
                    memberId: nowMember.userId,
                    memberImg: nowMember.userImg,
                    memberNickname: nowMember.nickName,
                    memberAgee: nowMember.userAge,
                    memberGen: nowMember.userGender,
                    memberDesc: nowMember.userContent,
                };
                newNearByPosts[i]['nowMember'].push(nowInfo);
            }
            newNearByPosts[i]['nickName'] = `${userInfo.nickName}`;
            newNearByPosts[i]['userAge'] = `${userInfo.userAge}`;
            newNearByPosts[i]['userGender'] = `${userInfo.userGender}`;
            newNearByPosts[i]['userImg'] = `${userInfo.userImg}`;
        }
        const nearPost = newNearByPosts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        res.status(200).json({ caPost, nearPost, filterRe });
    } catch (err) {
        console.log(err);
        res.status(400).send(' 메인 뽑아서 넘기기 포스트 오류');
    }
});

//근처 전체 리스트
router.get('/nearPostList', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { address } = user;

    try {
        var nearPosts = await Post.find({
            address,
        }).sort({ $natural: -1 });
        let userInfo = '';
        for (let i = 0; i < nearPosts.length; i++) {
            userInfo = await User.findOne({
                userId: nearPosts[i].userId,
            });
            nearPosts[i]['nickName'] = `${userInfo.nickName}`;
            nearPosts[i]['userAge'] = `${userInfo.userAge}`;
            nearPosts[i]['userGender'] = `${userInfo.userGender}`;
            nearPosts[i]['userImg'] = `${userInfo.userImg}`;
            nearPosts[i]['level'] = `${userInfo.level}`;
            let nowmemberId = [];
            let nowMember = '';
            for (let j = 0; j < nearPosts[i].nowMember.length; j++) {
                nowmemberId.push(nearPosts[i].nowMember[j]);
            }
            nearPosts[i]['nowMember'] = [];
            for (let j = 0; j < nowmemberId.length; j++) {
                nowMember = await User.findOne({
                    userId: nowmemberId[j],
                });
                nowInfo = {
                    memberId: nowMember.userId,
                    memberImg: nowMember.userImg,
                    memberNickname: nowMember.nickName,
                    memberAgee: nowMember.userAge,
                    memberGen: nowMember.userGender,
                    memberDesc: nowMember.userContent,
                    memberLevel: nowMember.level,
                    memberCategory: nowMember.userInterest,
                };
                nearPosts[i]['nowMember'].push(nowInfo);
            }
        }

        res.status(200).json({ nearPosts });
    } catch (err) {
        console.log(err);
        res.status(400).send('본인위치 근처 전체 포스트 오류');
    }
});

// 근처 전체 리스트 무한스크롤
router.get('/nearPostList/:pageNumber', authMiddleware, async (req, res) => {
    const { pageNumber } = req.params;
    const { user } = res.locals;
    const { address } = user;

    try {
        var nearPosts = await Post.find({
            address,
        })
            .sort({ $natural: -1 })
            .skip((pageNumber - 1) * 6)
            .limit(6);
        let userInfo = '';
        for (let i = 0; i < nearPosts.length; i++) {
            userInfo = await User.findOne({
                userId: nearPosts[i].userId,
            });
            nearPosts[i]['nickName'] = `${userInfo.nickName}`;
            nearPosts[i]['userAge'] = `${userInfo.userAge}`;
            nearPosts[i]['userGender'] = `${userInfo.userGender}`;
            nearPosts[i]['userImg'] = `${userInfo.userImg}`;
            nearPosts[i]['level'] = `${userInfo.level}`;
            let nowmemberId = [];
            let nowMember = '';
            for (let j = 0; j < nearPosts[i].nowMember.length; j++) {
                nowmemberId.push(nearPosts[i].nowMember[j]);
            }
            nearPosts[i]['nowMember'] = [];
            for (let j = 0; j < nowmemberId.length; j++) {
                nowMember = await User.findOne({
                    userId: nowmemberId[j],
                });
                nowInfo = {
                    memberId: nowMember.userId,
                    memberImg: nowMember.userImg,
                    memberNickname: nowMember.nickName,
                    memberAgee: nowMember.userAge,
                    memberGen: nowMember.userGender,
                    memberDesc: nowMember.userContent,
                    memberLevel: nowMember.level,
                    memberCategory: nowMember.userInterest,
                };
                nearPosts[i]['nowMember'].push(nowInfo);
            }
        }

        res.status(200).json({ nearPosts });
    } catch (err) {
        console.log(err);
        res.status(400).send('본인위치 근처 전체 포스트 오류');
    }
});

//특수문자 정규식
const regexr = /^[a-zA-Z0-9가-힣\s.~!,]{1,100}$/;
if (!regexr.test(userContent)) {
    return res.status(403).send('특수문자를 사용할 수 없습니다');
}

//이미지첨부 후기글이면 5점 아니면 3점주기
if (!image) {
    upEvalue = Number(3);
} else {
    upEvalue = Number(5);
}
//첫 후기글일때 5점 주기
const checkReview = await Review.find({
    userId,
});
if (!checkReview) {
    eventEvalue = Number(5);
} else {
    eventEvalue = Number(0);
}

// --------------- ----------- ㄹ ㅣ뷰 =-----------------------------
// 전체리뷰 조회
router.get('/reviewAll/:pageNumber', authMiddleware, async (req, res) => {
    const { pageNumber } = req.params;
    try {
        let allReviews = await Review.find({})
            .sort({ $natural: -1 })
            .skip((pageNumber - 1) * 6)
            .limit(6);
        // 전체 리뷰를 조회하되 프론트에서 필요한 정보만을 주기위해 key:1(true) 를 설정해줌
        // sort()함수에 $natural:-1 을 시켜 저장된 반대로 , 최신순으로 정렬시킴
        for (i = 0; i < allReviews.length; i++) {
            const userInfo = await User.findOne({
                userId: allReviews[i].userId,
            });
            allReviews[i]['nickName'] = `${userInfo.nickName}`;
            allReviews[i]['userAge'] = `${userInfo.userAge}`;
            allReviews[i]['userImg'] = `${userInfo.userImg}`;
        }
        res.status(201).send(allReviews);
    } catch (error) {
        console.error(error);
        res.status(401).send('리뷰 전체조회 실패');
    }
});

// 리뷰 조회
router.get('/review/:reviewId', authMiddleware, async (req, res) => {
    const { reviewId } = req.params;
    try {
        var reviews = await Review.find({ _id: reviewId });

        for (let i = 0; i < reviews.length; i++) {
            const userInfo = await User.findOne({
                userId: reviews[i].userId,
            });
            reviews[i]['nickName'] = `${userInfo.nickName}`;
            reviews[i]['userAge'] = `${userInfo.userAge}`;
            reviews[i]['userImg'] = `${userInfo.userImg}`;
        }

        res.status(200).json({ reviews });
    } catch (error) {
        console.log(error);
        res.status(400).send('review 조회 에러');
    }
});

// 리뷰 삭제
router.delete('/review/:reviewId', authMiddleware, async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.find({ _id: reviewId });

    const url = review[0].reviewImg.split('/');
    const delFileName = url[url.length - 1];
    try {
        await Review.deleteOne({ _id: reviewId });

        s3.deleteObject(
            {
                Bucket: 'practice2082',
                Key: delFileName,
            },
            (err, data) => {
                if (err) {
                    throw err;
                }
            }
        );
        res.send({ result: 'success' });
    } catch {
        res.status(400).send({ msg: '리뷰가 삭제되지 않았습니다.' });
    }
});

//신고하기
router.post('/report', authMiddleware, async (req, res) => {
    const { userId, content } = req.body;
    console.log(req.body);
    await Report.create({
        userId,
        content,
    });
    const userInfo = await User.findOne({
        userId,
    });
    let evalue = Number(userInfo.userEvalue) - Number(3);
    if (evalue >= 60) {
        level = 7;
    } else if (evalue >= 50) {
        level = 6;
    } else if (evalue >= 40) {
        level = 5;
    } else if (evalue >= 30) {
        level = 4;
    } else if (evalue >= 20) {
        level = 3;
    } else if (evalue >= 10) {
        level = 2;
    } else {
        level = 1;
    }
    await User.updateOne(
        { userId },
        {
            $set: {
                userEvalue: evalue,
                level,
            },
        }
    );
    res.send({ result: 'success' });
});

// 리뷰작성 api에서 이미지 업로드 api 빼내기
router.post(
    '/reviewImg',
    upload.single('image'),
    authMiddleware,
    async (req, res) => {
        let image = req.file?.location;
        res.status(200).json({ result: 'success', image });
    }
);

// 리뷰하는 레스토랑 정보
router.get(
    '/reviewRestaurant/:restaurantId',
    authMiddleware,
    async (req, res) => {
        try {
            const { restaurantId } = req.params;
            let restaurant = await restaurant.findOne({ _id: restaurantId });

            let nowmemberId = [];
            let nowMember = '';
            for (let i = 0; i < post.nowMember.length; i++) {
                nowmemberId.push(post.nowMember[i]);
            }
            post['nowMember'] = [];
            for (let i = 0; i < nowmemberId.length; i++) {
                nowMember = await User.findOne({
                    userId: nowmemberId[i],
                });
                nowInfo = {
                    memberId: nowMember.userId,
                    memberImg: nowMember.userImg,
                    memberNickname: nowMember.nickName,
                    memberAgee: nowMember.userAge,
                    memberGen: nowMember.userGender,
                    memberDesc: nowMember.userContent,
                };
                post['nowMember'].push(nowInfo);
            }

            res.status(200).json({ result: 'success', post });
        } catch (error) {
            console.log(error);
            res.status(400).send({ msg: '리뷰작성전 포스트 가져가기 실패' });
        }
    }
);
