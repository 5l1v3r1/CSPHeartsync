var checkincovers = require('./database/checkUser/checkinconversUser'),
    check_waiting_input = require('./database/checkUser/check_waiting_input'),
    getPartner = require('./database/partner/getPartner'),
    pending = require('./database/pair/pending'),
    sendMessage = require('./api/facebookAPI/sendMessage'),
    postInfoUser = require('./database/postInfoUser/postInfoUser'),
    chooseFavorite = require('./database/chooseFavorite'),
    waiting_url = require('./database/waiting_url'),
    waiting_mess = require('./database/waiting_mess'),
    waiting_confirm = require('./database/waiting_confirm'),
    send_anonymous_message = require('./database/send_anonymous_message'),
    receive_anonymous_message = require('./database/receive_anonymous_message'),
    endChat = require('./database/endchat');
var get_help = async(senderId) => {
    let a = await (sendMessage.sendTextMessageWithPromise(senderId, "Gõ một từ bất kỳ để bắt đầu một cuộc trò chuyện. Bạn cũng có thể bấm vào mục bắt đầu trò chuyện ở menu chatbot"));
    let b = await (sendMessage.sendTextMessage(senderId, "Gõ \"end\" khi đang trò chuyện để kết thúc cuộc trò chuyện đó, hoặc khi đang ở trong hàng đợi để thoát khỏi hàng đợi"));
    let c = await (sendMessage.sendTextMessage(senderId, "Gõ \"send message\" để bắt đầu chức năng gửi lời nhắn bí mật"));
    let d = await (sendMessage.sendTextMessage(senderId, "Gõ \"help\" để được trợ giúp về cách sử dụng chatbot"));
    let e = await (sendMessage.sendTextMessage(senderId, "CSP Heartsync là sản phẩm của câu lạc bộ ADaPT, được phát triển, điều hành bởi các thành viên của câu lạc bộ ADaPT. Mã nguồn của CSP Heartsync được cung cấp mở thông qua nền tảng github dưới giấy phép MIT. Mọi chi tiết xin liên hệ với chúng tôi ở fanpage CLB: https://www.facebook.com/ADAPT.CSP/"));
}
class asyncBot {
    reply(senderId, textInput) {
        if (textInput.toLowerCase() === 'help') {
            checkincovers.checkincovers(senderId).then(inconvers => {
                if (inconvers === 2) {
                    getPartner.getPartner(senderId).then(partnerId => {
                        sendMessage.sendTextMessage(partnerId, textInput);
                    })
                } else {
                    get_help(senderId);
                }
            })
        } else if (textInput.toLowerCase() === 'stop receiving message') {
            receive_anonymous_message.stop_receiving(senderId);
            sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Bạn sẽ không nhận được những tin nhắn ẩn danh nữa")
        } else if (textInput.toLowerCase() === 'start receiving message') {
            receive_anonymous_message.start_receiving(senderId);
            sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Bạn sẽ tiếp tục nhận được những tin nhắn ẩn danh")
        } else if (textInput.toLowerCase() === 'end') {
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
                            check_waiting_input.check_waiting_input(senderId, 'confirm').then(confirm => {
                                if (confirm !== false) {
                                    if (textInput.toLowerCase() === 'yes' || textInput.toLowerCase() === 'y') {
                                        send_anonymous_message.send_message(confirm.mess, confirm.fburl, 'text').then(res => {
                                            if (res === 'ok') {
                                                sendMessage.sendBotMessage(senderId, "Tin nhắn đã được gửi thành công", "Cảm ơn bạn");
                                            } else if (res === 'not receiving') {
                                                sendMessage.sendBotMessage(senderId, "Người nhận không chấp nhận tin nhắn", "Tin nhắn không thể được gửi");
                                            } else {
                                                sendMessage.sendBotMessage(senderId, "Người dùng không tồn tại hoặc đường link facebook của bạn bị lỗi", "Hãy kiểm tra lại đường link facebook");
                                            }
                                            waiting_confirm.remove(senderId);
                                        })
                                    } else if (textInput.toLowerCase() === 'no' || textInput.toLowerCase() === 'n') {
                                        sendMessage.sendBotMessage(senderId, "Yêu cầu gửi tin nhắn đã được hủy", "Cảm ơn bạn");
                                        waiting_confirm.remove(senderId);
                                    } else {
                                        sendMessage.sendButtonConfirm(senderId, confirm.fburl);
                                    }
                                } else if (is_waiting_mess !== false) {
                                    sendMessage.sendButtonConfirm(senderId, is_waiting_mess)
                                    waiting_mess.remove(senderId).then(a => {
                                        waiting_confirm.add(senderId, is_waiting_mess, textInput)
                                    })
                                } else if (is_waiting_url === true) {
                                    sendMessage.sendBotMessage(senderId, "Nhập tin nhắn của bạn", "Cảm ơn bạn")
                                    waiting_url.remove(senderId).then(a => {
                                        waiting_mess.add(senderId, textInput);
                                    })
                                } else if (incovers == null) {
                                    sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại")
                                } else if (incovers === 0) {
                                    sendMessage.sendButtonSelectGender(senderId);
                                } else if (incovers === 1) {
                                    sendMessage.sendTextMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé ");
                                } else if (incovers === 2) {
                                    getPartner.getPartner(senderId).then(partnerId => {
                                        sendMessage.sendTextMessage(partnerId, textInput);
                                    })
                                }
                            })
                        })
                    })
                })
            })()
        }
    }
    get_started(senderId) {
        postInfoUser.postInfoUser(senderId);
        sendMessage.sendBotMessage(senderId, "Chào bạn", "Chào mừng bạn đến với CSP Heartsync");
    }

    procPostback(senderId, payload) {
        switch (payload) {
            case "GET_STARTED":
                {
                    this.get_started(senderId);
                    break;
                }
            case "ANON_MESSAGE":
                {
                    this.reply(senderId, "send message");
                    break;
                }
            case "HELP":
                {
                    this.reply(senderId, "help");
                    break;
                }
            case "START_CHATTING":
                {
                    this.reply(senderId, "start");
                    break;
                }
            case "END_CHAT":
                {
                    this.reply(senderId, "end");
                    break;
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
            case "STOP_RECEIVING":
                {
                    this.reply(senderId, "stop receiving message");
                    break;
                }
            case "START_RECEIVING":
                {
                    this.reply(senderId, "start receiving message");
                    break;
                }
            case "YES":
                {
                    this.reply(senderId, "yes");
                    break;
                }
            case "NO":
                {
                    this.reply(senderId, "no");
                    break;
                }
        }
    };
    select(senderId, gender) {
        (async() => {
            let res = await (chooseFavorite.chooseFavorite(senderId, gender));
            let incovers = await (checkincovers.checkincovers(senderId));
            if (incovers == null) {
                sendMessage.sendTextMessage(senderId, "Đã có lỗi xảy ra. Vui lòng xóa tất cả inbox và thử lại")
            }
            if (incovers === 0) {
                sendMessage.sendBotMessage(senderId, "Đang tìm cặp cho bạn", res);
                pending.pending(senderId);
            }
            if (incovers === 1) {
                sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Hãy gõ end và bấm phím bất kỳ để lựa chọn của bạn trở nên có hiệu lực nhé ");
            }
            if (incovers === 2) {
                sendMessage.sendBotMessage(senderId, "Lựa chọn đã được ghi nhận", "Lựa chọn sẽ có hiệu lực trong cuộc trò chuyện tiếp theo");
            }
        })()
    }
    procImage(senderId, payload) {
        (async() => {
            checkincovers.checkincovers(senderId).then(incovers => {
                check_waiting_input.check_waiting_input(senderId, 'url').then(is_waiting_url => {
                    check_waiting_input.check_waiting_input(senderId, 'mess').then(is_waiting_mess => {
                        check_waiting_input.check_waiting_input(senderId, 'confirm').then(confirm => {
                            if (confirm !== false) {
                                sendMessage.sendButtonConfirm(senderId, confirm.fburl)
                            }
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
                                sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé ", "Cảm ơn bạn");
                            } else if (incovers === 2) {
                                getPartner.getPartner(senderId).then(partnerId => {
                                    sendMessage.sendImage(partnerId, payload);
                                })
                            }
                        })
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
                        check_waiting_input.check_waiting_input(senderId, 'confirm').then(confirm => {
                            if (confirm !== false) {
                                sendMessage.sendButtonConfirm(senderId, confirm.fburl)
                            }
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
                                sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé ", "Cảm ơn bạn");
                            } else if (incovers === 2) {
                                getPartner.getPartner(senderId).then(partnerId => {
                                    sendMessage.sendVideo(partnerId, payload);
                                })
                            }
                        })
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
                        check_waiting_input.check_waiting_input(senderId, 'confirm').then(confirm => {
                            if (confirm !== false) {
                                sendMessage.sendButtonConfirm(senderId, confirm.fburl)
                            }
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
                                sendMessage.sendBotMessage(senderId, "Bạn vẫn đang ở trong hàng đợi. Vui lòng chờ thêm một lúc nữa nhé ", "Cảm ơn bạn");
                            } else if (incovers === 2) {
                                getPartner.getPartner(senderId).then(partnerId => {
                                    sendMessage.sendAudio(partnerId, payload);
                                })
                            }
                        })
                    })
                })
            })
        })()
    }
}
module.exports = new asyncBot();