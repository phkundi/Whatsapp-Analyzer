import os
import json
from django.shortcuts import render, redirect
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.db.models import Sum

from .models import Chat

from analytics.Conversation import Conversation
from analytics.Analyzer import Analyzer
from analytics.NpEncoder import NpEncoder


def place_value(number): 
    return ("{:,}".format(number))

def get_msg_number():
    message_count = Chat.objects.aggregate(Sum('messages'))['messages__sum']
    if message_count:
        return place_value(message_count)
    return 0

def get_chat_number():
    chat_count = Chat.objects.all().count()
    if chat_count:
        return chat_count
    return 0

# Create your views here.
def homepage(request):

    raw_chat_ranking = Chat.objects.exclude(name__isnull=True).exclude(name__exact='').order_by('messages').reverse()
    chat_ranking = []

    for chat in raw_chat_ranking:
        chat_ranking.append({'name': chat.name, 'messages': place_value(chat.messages)})
        
    return render(request, 'web/index.html', {'chat_count': get_chat_number(), 'message_count': get_msg_number(), 'chat_ranking':chat_ranking})

def analyze(request):
    if request.method == 'POST' and request.FILES['myfile']:
        chat_name = request.POST.get('chat-name')
        myfile = request.FILES['myfile']

        fs = FileSystemStorage(location=os.path.join(settings.BASE_DIR, 'media/raw'))
        filename = fs.save(myfile.name, myfile)
        
        conversation = Conversation(filename=filename)
        conversation_data = conversation.parse_data()

        analyzer = Analyzer(conversation_data, chat_name)
        data = analyzer.analyze()

        year_data = analyzer.year_analysis()

        json_data = json.dumps(data, cls=NpEncoder)
        year_data_json = json.dumps(year_data, cls=NpEncoder)

        if not chat_name:
            chat = Chat(messages=data['Total_Messages'])
        else:
            chat = Chat(messages=data['Total_Messages'], name=chat_name)

        
    
        chat.save()

        conversation.delete_files()


        return render(request, 'web/analyze.html', {
            'json_data': json_data,
            'year_data': year_data_json,
            'year_count': year_data,
            'chat_count': get_chat_number(),
            'message_count': get_msg_number(),
            'chat_name': chat_name
    })

    return render(request, 'web/analyze.html')
