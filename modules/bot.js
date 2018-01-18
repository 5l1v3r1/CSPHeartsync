var checkincovers = require('./database/checkUser/checkinconversUser'),
    check_waiting_input = require('./database/checkUser/check_waiting_input'),
    getPartner = require('./database/partner/getPartner'),
    pending = require('./database/pair/pending'),
    sendMessage = require('./api/facebookAPI/sendMessage'),
    postInfoUser = require('./database/postInfoUser/postInfoUser'),
    chooseFavorite = require('./database/chooseFavorite'),
    waiting_url = require('./database/waiting_url'),
    waiting_mess = require('./database/waiting_mess'),
    send_anonymous_message = require('./database/send_anonymous_message'),
    receive_anonymous_message = require('./database/receive_anonymous_message'),
    endChat = require('./database/endchat');
class asyncBot {
    reply(senderId, textInput) {
        if (textInput.toLowerCase() === 'help') {
            let inconvers = await (checkincovers.checkincovers(senderId));
            if (inconvers === 2) {
                let partnerId = await (getPartner.getPartner(senderId));
                sendMessage.sendTextMessage(partnerId, textInput);
            } else {
                sendTextMessage(senderId, "Gõ một từ bất kỳ để bắt đầu một cuộc trò chuyện. Bạn cũng có thể bấm vào mục bắt đầu trò chuyện ở menu chatbot")
                sendTextMessage(senderId, "Gõ \"end\" khi đang trò chuyện để kết thúc cuộc trò chuyện đó, hoặc khi đang ở trong hàng đợi để thoát khỏi hàng đợi")
                sendTextMessage(senderId, "Gõ \"send message\" để bắt đầu chức năng gửi tin lời nhắn bí mật")
                sendTextMessage(senderId, "Gõ \"help\" để được trợ giúp về cách sử dụng chatbot")
            }
        }
        if (textInput.toLowerCase() === 'stop receiving message') {
            receive_anonymous_message.stop_receiving(senderId);
            sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Bạn sẽ không nhận được những tin nhắn ẩn danh nữa")
        } else if (textInput.toLowerCase() === 'start receiving message') {
            receive_anonymous_message.start_receiving(senderId);
            sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Bạn sẽ tiếp tục nhận được những tin nhắn ẩn danh")
        } else if (textInput.toLowerCase() === 'end chat') {
            endChat.endChat(senderId)
        } else if (textInput.toLowerCase() === 'send message') {
            check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                sendMessage.sendBotMessage(senderId, "Hãy nhập link facebook của người nhận", "Cảm ơn bạn");
                if (is_waiting_url === false) {
                    waiting_url.add(senderId);
                }
            })
        } else {
            (async() => {
                checkincovers.checkincovers(senderId).then(incovers => {
                    check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                        check_waiting_input.check_waiting_input(senderId, 'mess').then(is_waiting_mess => {
                            if (is_waiting_mess !== false) {
                                send_anonymous_message.send_message(textInput, is_waiting_mess, 'text').then(res => {
                                    if (res === 'ok') {
                                        sendMessage.sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                                    } else if (res === 'not receiving') {
                                        sendMessage.sendBotMessage(senderId, "Người nhận không chấp nhận tin nhắn", "Tin nhắn không thể được gửi");
                                    } else {
                                        sendMessage.sendBotMessage(senderId, "Người dùng không tồn tại hoặc đường link facebook của bạn bị lỗi", "Hãy kiểm tra lại đường link facebook");
                                    }
                                    waiting_mess.remove(senderId);
                                })
                            } else if (is_waiting_url === true) {
                                sendMessage.sendBotMessage(senderId, "Nhập tin nhắn của bạn", "Cảm ơn bạn")
                                waiting_url.remove(senderId);
                                waiting_mess.add(senderId, val);
                            } else if (incovers == null) {
                                sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại")
                            } else if (incovers === 0) {
                                sendMessage.sendButtonSelectGender(senderId);
                            } else if (incovers === 1) {
                                sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3");
                            } else if (incovers === 2) {
                                let partnerId = await (getPartner.getPartner(senderId));
                                sendMessage.sendTextMessage(partnerId, textInput);
                            }
                        })
                    })
                })
            })()
        }
    }
    get_started(senderId) {
        postInfoUser.postInfoUser(senderId);
        sendMessage.sendBotMessage(senderId, "Chào bạn <3", "Chào mừng bạn đến với CSP Heartsync");
    }

    procPostback(senderId, payload) {
        switch (payload) {
            console.log (payload)
            case "GET_STARTED":
                {
                    this.get_started(senderId);
                    break;
                }
            case "ANON_MESSAGE":
                {
                    this.reply(senderId, "send message");
                }
            case "HELP":
                {
                    this.reply(senderId, "help");
                }
            case "START_CHATTING":
                {
                    this.reply(senderId, "start");
                }
            case "SELECT_MALE":
                {
                    this.select(senderId, 'male');
                    break;
                }
            case "SELECT_FEMALE":
                {
                    this.select(senderId, 'female');
                    break;
                }
            case "SELECT_ANY":
                {
                    this.select(senderId, 'none');
                    break;
                }
            case "CHANGE_FAV":
                {
                    sendMessage.sendButtonSelectGender(senderId)
                    break;
                }
        }
    }
    select(senderId, gender) {
        (async() => {
            let res = await (chooseFavorite.chooseFavorite(senderId, gender));
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) {
                sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại")
            }
            if (incovers === 0) {
                sendMessage.sendBotMessage(senderId, "Đang tìm cặp cho bạn <3", res);
                pending.pending(senderId);
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
        (async() => {
            checkincovers.checkincovers(senderId).then(incovers => {
                check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                    check_waiting_input.check_waiting_input(senderId, 'mess').then(is_waiting_mess => {
                        if (is_waiting_url !== false) {
                            sendMessage.sendBotMessage(senderId, "Đây không phải là 1 đường link hợp lệ", "Hãy nhập lại đường link facebook của người nhận")
                        } else if (is_waiting_mess !== false) {
                            send_anonymous_message.send_message(payload, is_waiting_mess, 'img').then(res => {
                                if (res === 'ok') {
                                    sendMessage.sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                                } else if (res === 'not receiving') {
                                    sendMessage.sendBotMessage(senderId, "Người nhận không chấp nhận tin nhắn", "Tin nhắn không thể được gửi");
                                } else {
                                    sendMessage.sendBotMessage(senderId, "Người dùng không tồn tại hoặc đã có lỗi xảy ra", "Xin lỗi bạn vì sự cố này");
                                }
                                waiting_mess.remove(senderId);
                            });
                        } else if (incovers == null) {
                            sendMessage.sendBotMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại", "Cảm ơn bạn")
                        } else if (incovers === 0) {
                            sendMessage.sendButtonSelectGender(senderId);
                        } else if (incovers === 1) {
                            sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3", "Cảm ơn bạn");
                        } else if (incovers === 2) {
                            let partnerId = await (getPartner.getPartner(senderId));
                            sendMessage.sendImage(partnerId, payload);
                        }
                    })
                })
            })
        })()
    }
    procVideo(senderId, payload) {
        (async() => {
            checkincovers.checkincovers(senderId).then(incovers => {
                check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                    check_waiting_input.check_waiting_input(senderId, 'mess').then(is_waiting_mess => {
                        if (is_waiting_url !== false) {
                            sendMessage.sendBotMessage(senderId, "Đây không phải là 1 đường link hợp lệ", "Hãy nhập lại đường link facebook của người nhận")
                        } else if (is_waiting_mess !== false) {
                            send_anonymous_message.send_message(payload, is_waiting_mess, 'video').then(res => {
                                if (res === 'ok') {
                                    sendMessage.sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                                } else if (res === 'not receiving') {
                                    sendMessage.sendBotMessage(senderId, "Người nhận không chấp nhận tin nhắn", "Tin nhắn không thể được gửi");
                                } else {
                                    sendMessage.sendBotMessage(senderId, "Người dùng không tồn tại hoặc đã có lỗi xảy ra", "Xin lỗi bạn vì sự cố này");
                                }
                                waiting_mess.remove(senderId);
                            });
                        } else if (incovers == null) {
                            sendMessage.sendBotMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại", "Cảm ơn bạn")
                        } else if (incovers === 0) {
                            sendMessage.sendButtonSelectGender(senderId);
                        } else if (incovers === 1) {
                            sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3", "Cảm ơn bạn");
                        } else if (incovers === 2) {
                            let partnerId = await (getPartner.getPartner(senderId));
                            sendMessage.sendVideo(partnerId, payload);
                        }
                    })
                })
            })
        })()
    }
    procAudio(senderId, payload) {
        (async() => {
            checkincovers.checkincovers(senderId).then(incovers => {
                check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                    check_waiting_input.check_waiting_input(senderId, 'mess').then(is_waiting_mess => {
                        if (is_waiting_url !== false) {
                            sendMessage.sendBotMessage(senderId, "Đây không phải là 1 đường link hợp lệ", "Hãy nhập lại đường link facebook của người nhận")
                        } else if (is_waiting_mess !== false) {
                            send_anonymous_message.send_message(payload, is_waiting_mess, 'audio').then(res => {
                                if (res === 'ok') {
                                    sendMessage.sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                                } else if (res === 'not receiving') {
                                    sendMessage.sendBotMessage(senderId, "Người nhận không chấp nhận tin nhắn", "Tin nhắn không thể được gửi");
                                } else {
                                    sendMessage.sendBotMessage(senderId, "Người dùng không tồn tại hoặc đã có lỗi xảy ra", "Xin lỗi bạn vì sự cố này");
                                }
                                waiting_mess.remove(senderId);
                            });
                        } else if (incovers == null) {
                            sendMessage.sendBotMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại", "Cảm ơn bạn")
                        } else if (incovers === 0) {
                            sendMessage.sendButtonSelectGender(senderId);
                        } else if (incovers === 1) {
                            sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé <3", "Cảm ơn bạn");
                        } else if (incovers === 2) {
                            let partnerId = await (getPartner.getPartner(senderId));
                            sendMessage.sendAudio(partnerId, payload);
                        }
                    })
                })
            })
        })()
    }
}
module.exports = new asyncBot();