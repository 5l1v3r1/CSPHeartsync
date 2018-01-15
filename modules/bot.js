var checkincovers = require('./database/checkUser/checkinconversUser'),
    check_waiting_input = require('./database/checkUser/check_waiting_input'),
    getPartner = require('./database/partner/getPartner'),
    pending = require('./database/pair/pending'),
    sendMessage = require('./api/facebookAPI/sendMessage'),
    postInfoUser = require('./database/postInfoUser/postInfoUser'),
    chooseFavorite = require('./database/chooseFavorite'),
    waiting_url = require('./database/waiting_url'),
    waiting_mess = require('./database/waiting_mess'),
    endChat = require('./database/endchat');
class asyncBot {
    reply(senderId, textInput) {
        textInput = textInput.toLowerCase();
        if (textInput === 'đổi giới tính') { sendMessage.sendButtonSelectGender(senderId) }
        else if (textInput === 'end chat' | textInput === 'end') { endChat.endChat(senderId) }
        else if (textInput === 'send message')
        {
            let waiting_url = await (check_waiting_input.check_waiting_input(senderId, 'url'));
            sendBotMessage(senderId, "Hãy nhập link facebook của người nhận", "Cảm ơn bạn");
            if (waiting_url === false) 
            {
                waiting_url.add (senderId);
            }
        }
        else {
            (async () => {
                let incovers = await (checkincovers.checkincovers(senderId));
                let waiting_url = await (check_waiting_input.check_waiting_input(senderId, 'url'));
                let waiting_mess = await (check_waiting_input.check_waiting_input(senderId, 'mess'));
                if (waiting_mess !== false)
                {
                    let res = await send_anonymous_message.send_message (textInput, waiting_mess);
                    if (res === 'not found')
                    {
                        sendBotMessage(senderId, "Người dùng không tồn tại hoặc đã có lỗi xảy ra", "Xin lỗi bạn vì sự cố này");
                    }
                    else 
                    {
                        sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                    }
                }
                else if (waiting_url === true)
                {
                    waiting_url.remove (senderId);
                    waiting_mess.add (senderId, textInput);
                }
                else if (incovers == null) { sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại") }
                else if (incovers === 0) {
                    sendMessage.sendButtonSelectGender (senderId);
                }
                else if (incovers === 1) {
                    sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3");
                }
                else if (incovers === 2) {
                    let partnerId = await (getPartner.getPartner(senderId));
                    sendMessage.sendTextMessage(partnerId, textInput);
                }
            })()
        }
    }
    get_started(senderId) {
        postInfoUser.postInfoUser(senderId);
        sendMessage.sendTextMessage(senderId, "Chào bạn <3");
    }

    procPostback(senderId, payload) {
        switch (payload) {
            case "GET_STARTED": {
                this.get_started(senderId);
                break;
            }
            case "SELECT_MALE": {
                this.select(senderId, 'male');
                break;
            }
            case "SELECT_FEMALE": {
                this.select(senderId, 'female');
                break;
            }
            case "SELECT_ANY": {
                this.select(senderId, 'none');
                break;
            }
            case "CHANGE_FAV":{
                sendMessage.sendButtonSelectGender(senderId)
                break;
            }
        }
    }
    select(senderId, gender) {
        (async () => {
            let res = await (chooseFavorite.chooseFavorite(senderId, gender));
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) { sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại") }
            if (incovers === 0) {
                sendMessage.sendBotMessage(senderId, "Đang tìm cặp cho bạn <3", res);
                pending.pending (senderId);
            }
            if (incovers === 1) {
                sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Hãy gõ end và bấm phím bất kỳ để lựa chọn của bạn trở nên có hiệu lực nhé <3");
            }
            if (incovers === 2) {
                sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Lựa chọn sẽ có hiệu lực trong cuộc trò chuyện tiếp theo <3");
            }
        })()
    }
    procImage(senderId, payload) {
        (async () => {
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) { sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại") }
            if (incovers === 0) {
                sendMessage.sendButtonSelectGender (senderId);
            }
            if (incovers === 1) {
                sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3");
            }
            if (incovers === 2) {
                let partnerId = await (getPartner.getPartner(senderId));
                sendMessage.sendImage(partnerId, payload);
            }
        })()
    }
    procVideo(senderId, payload) {
        (async () => {
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) { sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại") }
            if (incovers === 0) {
                sendMessage.sendButtonSelectGender (senderId);
            }
            if (incovers === 1) {
                sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3");
            }
            if (incovers === 2) {
                let partnerId = await (getPartner.getPartner(senderId));
                sendMessage.sendVideo(partnerId, payload);
            }
        })()
    }
    procAudio(senderId, payload) {
        (async () => {
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) { sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại") }
            if (incovers === 0) {
                sendMessage.sendButtonSelectGender (senderId);
            }
            if (incovers === 1) {
                sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3");
            }
            if (incovers === 2) {
                let partnerId = await (getPartner.getPartner(senderId));
                sendMessage.sendAudio(partnerId, payload);
            }
        })()
    }
}
module.exports = new asyncBot();