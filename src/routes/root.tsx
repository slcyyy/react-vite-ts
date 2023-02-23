import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit
} from 'react-router-dom';
import { useEffect } from 'react';
import { getContacts, ContactType, createContact } from '../contacts';

export async function loader({ request }) {
  //  refresh后仍然存在
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  console.log('q', q);
  const contacts = await getContacts(q);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// 回退之后，因为不会重新渲染input，defaultValue只在第一次有效，search框还是旧值
export default function Root() {
  console.log('render');
  // state action & loader返回的数据
  const { contacts, q } = useLoaderData() as {
    contacts: ContactType[];
    q: string;
  };
  // useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading".
  const navigation = useNavigation();
  const submit = useSubmit();

  useEffect(() => {
    document.getElementById('q').value = q;
  }, [q]);

  // The navigation.location will show up when the app is navigating to a new URL and loading the data for it. It then goes away when there is no pending navigation anymore.
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has('q');

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            {/* 会自动搜集name并序列化，form默认get(原生同) */}
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              defaultValue={q}
              name="q"
              onChange={(event) => {
                const isFirstSearch = q == null;
                // 不会压入新栈
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* 原生form也会有页面刷新问题 */}
          {/* Form阻止向后端发起服务，而是发送给路由进行操作 */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* a标签拼接后的路径、作用是一样的，但是会造成页面刷新 */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? 'active' : isPending ? 'pending' : ''
                    }
                  >
                    {/* other code */}
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{' '}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        {/* 使用children route */}
        <Outlet />
      </div>
    </>
  );
}
