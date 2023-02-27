import { Form, useLoaderData, useFetcher } from 'react-router-dom';
import { getContact, ContactType, updateContact } from '../contacts';

export async function loader({ params }: { params: any }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response('', {
      status: 404,
      statusText: 'Not Found'
    });
  }
  return contact;
}

export async function action({
  request,
  params
}: {
  request: any;
  params: ContactType;
}) {
  const formData = await request.formData();
  return updateContact(params.contactId || '', {
    favorite: formData.get('favorite') === 'true'
  });
}

export default function Contact() {
  // const contact = {
  //   first: 'Your',
  //   last: 'Name',
  //   avatar: 'https://placekitten.com/g/200/200',
  //   twitter: 'your_handle',
  //   notes: 'Some notes',
  //   favorite: true
  // };
  const contact = useLoaderData() as ContactType;
  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact?.avatar} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
              rel="noreferrer"
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          {/* 路由直接再拼接/edit */}
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm('Please confirm you want to delete this record.')) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: any) {
  const fetcher = useFetcher();
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true';
  }
  return (
    // This form will send formData with a favorite key that's either "true" | "false"
    // , it will post to the route where the form is rendered.
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  );
}
