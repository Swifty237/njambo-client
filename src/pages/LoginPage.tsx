import React, { useRef, useContext, useEffect } from 'react';
import Container from '../components/layout/Container';
import { Link, useHistory } from 'react-router-dom';
import HeadingWithLogo from '../components/typography/HeadingWithLogo';
import Button from '../components/buttons/Button';
import { Input } from '../components/forms/Input';
import { Form } from '../components/forms/Form';
import { FormGroup } from '../components/forms/FormGroup';
import { ButtonGroup } from '../components/forms/ButtonGroup';
import { Label } from '../components/forms/Label';
import RelativeWrapper from '../components/layout/RelativeWrapper';
import ShowPasswordButton from '../components/buttons/ShowPasswordButton';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import authContext from '../context/auth/authContext';
import contentContext from '../context/content/contentContext';
import styled from 'styled-components';

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(220, 53, 69, 0.1);
  text-align: center;
`;
// import { TiledBackgroundImage } from '../components/decoration/TiledBackgroundImage';

const LoginPage = () => {
  const { getLocalizedString } = useContext(contentContext);
  const { login, isLoggedIn, authError, clearAuthError } = useContext(authContext);
  const history = useHistory();

  useScrollToTopOnPageLoad();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  // Nettoyer les erreurs quand le composant est démonté
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn, history]);

  // if (isLoggedIn) return null; // Éviter le rendu pendant la redirection
  return (
    <RelativeWrapper>
      {/* <TiledBackgroundImage /> */}
      <Container
        fullHeight
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="6rem 2rem 2rem 2rem"
        contentCenteredMobile
      >
        <Form
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const email = emailRef.current?.value;
            const password = passwordRef.current?.value;

            if (email && password && email.length > 0 && password.length > 0) {
              clearAuthError(); // Nettoyer les erreurs précédentes
              const success = await login(email, password);
              if (!success) {
                // Focus sur le champ email en cas d'échec
                emailRef.current?.focus();
              }
            }
          }}
        >
          <HeadingWithLogo textCentered hideIconOnMobile={false}>
            {getLocalizedString('login_page-header_txt')}
          </HeadingWithLogo>

          {authError && <ErrorMessage>{authError}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="email">
              {getLocalizedString('login_page-email_lbl_txt')}
            </Label>
            <Input
              type="email"
              name="email"
              ref={emailRef}
              required
              autoComplete="email"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">
              {getLocalizedString('login_page-password_lbl_txt')}
            </Label>
            <ShowPasswordButton passwordRef={passwordRef} />
            <Input
              type="password"
              name="password"
              ref={passwordRef}
              autoComplete="current-password"
              required
            />
          </FormGroup>
          <ButtonGroup>
            <Button $primary type="submit" $fullWidth>
              {getLocalizedString('login_page-cta_btn_txt')}
            </Button>
            {/* <Link to="/">I foI do not have an account yet!rgot my password!</Link> */}
            <Link to="/register">
              {getLocalizedString('login_page-no_account_txt')}
            </Link>
          </ButtonGroup>
        </Form>
      </Container>
    </RelativeWrapper>
  );
};

export default LoginPage;
