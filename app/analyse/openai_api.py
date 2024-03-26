from openai import OpenAI


def request_external_llm(repo, forks, question):
    client = OpenAI()
    chat_completion = client.chat.completions.create(
    messages=[
            {
                "role": "user",
                "content": f"I am looking into adding some fetures to the following github repositories, the repo name is {repo}."
                "The following content is the fork information for different forks."
            },
            {
                "role": "user",
                "content": forks
            }, 
            {
                "role": "user",
                "content": f"And my question is {question}"
            }

        ],
        model="gpt-3.5-turbo",
    )

    print(chat_completion.choices[0].message.content)
    return (chat_completion.choices[0].message.content)
    # print(code_diff)
    # return(code_diff)

def request_external_llm_fork(repo, fork, fork_diff, question):
    client = OpenAI()
    chat_completion = client.chat.completions.create(
    messages=[
            {
                "role": "user",
                "content": f"I am looking into this fork of the following github repositories, the repo name is {repo}."
                f"The fork name is ${fork}, the following information is the change made in this fork"
            },
            {
                "role": "user",
                "content": fork_diff
            }, 
            {
                "role": "user",
                "content": f"And my question is {question}"
            }

        ],
        model="gpt-3.5-turbo",
    )

    print(chat_completion.choices[0].message.content)
    return (chat_completion.choices[0].message.content)
def summarize_change(diff_json):
    client = OpenAI()
    chat_completion = client.chat.completions.create(
    messages=[
            {
                "role": "user",
                "content": "summarize the code change below:"
            },
            {
                "role": "user",
                "content": "tell me what this fork did in general given the following change Put you answer in one paragraph, using less than 150 words." + str(diff_json)
            }

        ],
        model="gpt-3.5-turbo",
    )

    print(chat_completion.choices[0].message.content)
    return (chat_completion.choices[0].message.content)