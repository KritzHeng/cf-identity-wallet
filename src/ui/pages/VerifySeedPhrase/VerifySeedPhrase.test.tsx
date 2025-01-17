import { MemoryRouter, Route, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Provider } from "react-redux";
import { render, waitFor } from "@testing-library/react";
import {
  ionFireEvent as fireEvent,
  waitForIonicReact,
} from "@ionic/react-test-utils";
import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import { GenerateSeedPhrase } from "../GenerateSeedPhrase";
import { VerifySeedPhrase } from "../VerifySeedPhrase";
import { RoutePath } from "../../../routes";
import { store } from "../../../store";
import EN_TRANSLATIONS from "../../../locales/en/en.json";
import {
  FIFTEEN_WORDS_BIT_LENGTH,
  MNEMONIC_FIFTEEN_WORDS,
  TWENTYFOUR_WORDS_BIT_LENGTH,
} from "../../globals/constants";
import { KeyStoreKeys, SecureStorage } from "../../../core/storage";
import { Addresses } from "../../../core/cardano";

const entropy = "entropy";
const rootKeyBech32 = "rootKeyBech32";
const rootKeyHex = "rootKeyHex";

jest.mock("../../../core/storage");
jest.mock("../../../core/cardano/addresses");
Addresses.convertToEntropy = jest.fn().mockReturnValue(entropy);
Addresses.entropyToBip32NoPasscode = jest.fn().mockReturnValue(rootKeyBech32);
Addresses.bech32ToHexBip32Private = jest.fn().mockReturnValue(rootKeyHex);

describe("Verify Seed Phrase Page", () => {
  const mockStore = configureStore();
  const dispatchMock = jest.fn();
  const initialState = {
    stateCache: {
      routes: [RoutePath.VERIFY_SEED_PHRASE],
      authentication: {
        loggedIn: true,
        time: Date.now(),
        passcodeIsSet: true,
        seedPhraseIsSet: false,
      },
    },
    seedPhraseCache: {
      seedPhrase160:
        "example1 example2 example3 example4 example5 example6 example7 example8 example9 example10 example11 example12 example13 example14 example15",
      seedPhrase256: "",
      selected: FIFTEEN_WORDS_BIT_LENGTH,
    },
  };

  const storeMocked = {
    ...mockStore(initialState),
    dispatch: dispatchMock,
  };
  test("The user can navigate from Generate to Verify Seed Phrase page with a default 15 words seed phrase", async () => {
    const seedPhrase: string[] = [];
    const { getByTestId, queryByText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[RoutePath.GENERATE_SEED_PHRASE]}>
          <Route
            path={RoutePath.GENERATE_SEED_PHRASE}
            component={GenerateSeedPhrase}
          />
          <Route
            path={RoutePath.VERIFY_SEED_PHRASE}
            component={VerifySeedPhrase}
          />
        </MemoryRouter>
      </Provider>
    );

    const revealSeedPhraseButton = getByTestId("reveal-seed-phrase-button");
    const termsCheckbox = getByTestId("terms-and-conditions-checkbox");
    const generateContinueButton = getByTestId(
      "primary-button-generate-seed-phrase"
    );

    act(() => {
      fireEvent.click(revealSeedPhraseButton);
      fireEvent.click(termsCheckbox);
      fireEvent.click(generateContinueButton);
    });
    await waitForIonicReact();

    const seedPhraseContainer = getByTestId("seed-phrase-container");
    for (let i = 0, len = seedPhraseContainer.childNodes.length; i < len; i++) {
      seedPhrase.push(
        seedPhraseContainer.childNodes[i].childNodes[1].textContent || ""
      );
    }

    const generateConfirmButton = getByText(
      EN_TRANSLATIONS.generateseedphrase.alert.confirm.button.confirm
    );

    act(() => {
      fireEvent.click(generateConfirmButton);
    });

    await waitFor(() =>
      expect(
        queryByText(EN_TRANSLATIONS.verifyseedphrase.onboarding.title)
      ).toBeVisible()
    );

    for (let i = 0, len = seedPhrase.length; i < len; i++) {
      await waitFor(() => expect(queryByText(seedPhrase[i])).toBeVisible());
    }
  });

  test("The user can navigate from Generate to Verify Seed Phrase page selecting a 24 words seed phrase", async () => {
    const seedPhrase: string[] = [];
    const { getByTestId, queryByText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[RoutePath.GENERATE_SEED_PHRASE]}>
          <Route
            path={RoutePath.GENERATE_SEED_PHRASE}
            component={GenerateSeedPhrase}
          />
          <Route
            path={RoutePath.VERIFY_SEED_PHRASE}
            component={VerifySeedPhrase}
          />
        </MemoryRouter>
      </Provider>
    );

    const segment = getByTestId("mnemonic-length-segment");
    const revealSeedPhraseButton = getByTestId("reveal-seed-phrase-button");
    const termsCheckbox = getByTestId("terms-and-conditions-checkbox");
    const generateContinueButton = getByTestId(
      "primary-button-generate-seed-phrase"
    );

    act(() => {
      fireEvent.ionChange(segment, `${TWENTYFOUR_WORDS_BIT_LENGTH}`);
      fireEvent.click(revealSeedPhraseButton);
      fireEvent.click(termsCheckbox);
      fireEvent.click(generateContinueButton);
    });
    await waitForIonicReact();

    const seedPhraseContainer = getByTestId("seed-phrase-container");
    for (let i = 0, len = seedPhraseContainer.childNodes.length; i < len; i++) {
      seedPhrase.push(
        seedPhraseContainer.childNodes[i].childNodes[1].textContent || ""
      );
    }

    const generateConfirmButton = getByText(
      EN_TRANSLATIONS.generateseedphrase.alert.confirm.button.confirm
    );

    act(() => {
      fireEvent.click(generateConfirmButton);
    });

    await waitFor(() =>
      expect(
        queryByText(EN_TRANSLATIONS.verifyseedphrase.onboarding.title)
      ).toBeVisible()
    );

    for (let i = 0, len = seedPhrase.length; i < len; i++) {
      await waitFor(() => expect(queryByText(seedPhrase[i])).toBeVisible());
    }
  });

  test("The user can't Verify the Seed Phrase", async () => {
    const { getByTestId, queryByText } = render(
      <Provider store={storeMocked}>
        <MemoryRouter initialEntries={[RoutePath.VERIFY_SEED_PHRASE]}>
          <Route
            path={RoutePath.VERIFY_SEED_PHRASE}
            component={VerifySeedPhrase}
          />
        </MemoryRouter>
      </Provider>
    );

    const continueButton = getByTestId("primary-button-verify-seed-phrase");
    const originalSeedPhraseContainer = getByTestId(
      "original-seed-phrase-container"
    );
    const matchingSeedPhraseContainer = getByTestId(
      "matching-seed-phrase-container"
    );
    await waitFor(() =>
      expect(originalSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    expect(continueButton).toBeDisabled();

    for (let index = 0; index < MNEMONIC_FIFTEEN_WORDS; index++) {
      fireEvent.click(originalSeedPhraseContainer.childNodes[0]);
    }

    await waitFor(() =>
      expect(matchingSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    await waitFor(() =>
      expect(continueButton).toHaveAttribute("disabled", "false")
    );

    fireEvent.click(continueButton);

    await waitFor(() =>
      expect(
        queryByText(EN_TRANSLATIONS.verifyseedphrase.alert.fail.text)
      ).toBeVisible()
    );

    expect(Addresses.convertToEntropy).not.toBeCalled();
    expect(Addresses.entropyToBip32NoPasscode).not.toBeCalled();
    expect(SecureStorage.set).not.toBeCalled();
  });

  test("The user can Verify the Seed Phrase when Onboarding", async () => {
    const history = createMemoryHistory();
    history.push(RoutePath.VERIFY_SEED_PHRASE);
    const { getByTestId, getByText } = render(
      <Provider store={storeMocked}>
        <Router history={history}>
          <VerifySeedPhrase />
        </Router>
      </Provider>
    );

    const continueButton = getByTestId("primary-button-verify-seed-phrase");
    const originalSeedPhraseContainer = getByTestId(
      "original-seed-phrase-container"
    );
    const matchingSeedPhraseContainer = getByTestId(
      "matching-seed-phrase-container"
    );
    await waitFor(() =>
      expect(originalSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    expect(continueButton).toBeDisabled();

    initialState.seedPhraseCache.seedPhrase160
      .split(" ")
      .forEach(async (word) => {
        fireEvent.click(getByText(`${word}`));
      });

    await waitFor(() =>
      expect(matchingSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    await waitFor(() =>
      expect(continueButton).toHaveAttribute("disabled", "false")
    );

    fireEvent.click(continueButton);

    const seedPhraseString = initialState.seedPhraseCache.seedPhrase160;
    const entropy = Addresses.convertToEntropy(seedPhraseString);
    const Bech32XPrv = Addresses.entropyToBip32NoPasscode(seedPhraseString);
    expect(Addresses.convertToEntropy).toBeCalledWith(seedPhraseString);
    expect(Addresses.entropyToBip32NoPasscode).toBeCalledWith(entropy);
    expect(Addresses.bech32ToHexBip32Private).toBeCalledWith(Bech32XPrv);

    expect(SecureStorage.set).toBeCalledWith(
      KeyStoreKeys.IDENTITY_ROOT_XPRV_KEY,
      rootKeyHex
    );

    await waitFor(() =>
      expect(SecureStorage.set).toBeCalledWith(
        KeyStoreKeys.IDENTITY_ENTROPY,
        entropy
      )
    );
  });

  test("The user can Verify the Seed Phrase when generating a new seed phrase", async () => {
    const history = createMemoryHistory();
    history.push(RoutePath.VERIFY_SEED_PHRASE);
    const { getByTestId, getByText } = render(
      <Provider store={storeMocked}>
        <Router history={history}>
          <VerifySeedPhrase />
        </Router>
      </Provider>
    );

    const continueButton = getByTestId("primary-button-verify-seed-phrase");
    const originalSeedPhraseContainer = getByTestId(
      "original-seed-phrase-container"
    );
    const matchingSeedPhraseContainer = getByTestId(
      "matching-seed-phrase-container"
    );
    await waitFor(() =>
      expect(originalSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    expect(continueButton).toBeDisabled();

    initialState.seedPhraseCache.seedPhrase160
      .split(" ")
      .forEach(async (word) => {
        fireEvent.click(getByText(`${word}`));
      });

    await waitFor(() =>
      expect(matchingSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    await waitFor(() =>
      expect(continueButton).toHaveAttribute("disabled", "false")
    );

    fireEvent.click(continueButton);

    const seedPhraseString = initialState.seedPhraseCache.seedPhrase160;
    const entropy = Addresses.convertToEntropy(seedPhraseString);
    const Bech32XPrv = Addresses.entropyToBip32NoPasscode(seedPhraseString);
    expect(Addresses.convertToEntropy).toBeCalledWith(seedPhraseString);
    expect(Addresses.entropyToBip32NoPasscode).toBeCalledWith(entropy);
    expect(Addresses.bech32ToHexBip32Private).toBeCalledWith(Bech32XPrv);
  });

  test("calls handleOnBack when back button is clicked", async () => {
    const mockStore = configureStore();
    const dispatchMock = jest.fn();
    const initialState = {
      stateCache: {
        routes: [RoutePath.VERIFY_SEED_PHRASE],
        authentication: {
          loggedIn: true,
          time: Date.now(),
          passcodeIsSet: true,
          seedPhraseIsSet: false,
        },
      },
      seedPhraseCache: {
        seedPhrase160: "example1 example2 example3 example4 example5",
        seedPhrase256: "",
        selected: FIFTEEN_WORDS_BIT_LENGTH,
      },
    };

    const storeMocked = {
      ...mockStore(initialState),
      dispatch: dispatchMock,
    };
    const { getByTestId, getByText } = render(
      <Provider store={storeMocked}>
        <MemoryRouter initialEntries={[RoutePath.VERIFY_SEED_PHRASE]}>
          <Route
            path={RoutePath.VERIFY_SEED_PHRASE}
            component={VerifySeedPhrase}
          />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(getByText("example1"));
    fireEvent.click(getByText("example2"));
    fireEvent.click(getByText("example3"));
    fireEvent.click(getByText("example4"));
    fireEvent.click(getByText("example5"));

    const continueButton = getByTestId(
      "primary-button-verify-seed-phrase"
    ) as HTMLButtonElement;

    expect(continueButton.disabled).toBe(false);

    const backButton = getByTestId("back-button");
    act(() => {
      fireEvent.click(backButton);
    });

    expect(continueButton.disabled).toBe(true);
  });

  test("The user can remove words from the Seed Phrase", async () => {
    const { getByTestId } = render(
      <Provider store={storeMocked}>
        <MemoryRouter initialEntries={[RoutePath.VERIFY_SEED_PHRASE]}>
          <Route
            path={RoutePath.VERIFY_SEED_PHRASE}
            component={VerifySeedPhrase}
          />
        </MemoryRouter>
      </Provider>
    );

    const continueButton = getByTestId("primary-button-verify-seed-phrase");
    const originalSeedPhraseContainer = getByTestId(
      "original-seed-phrase-container"
    );
    const matchingSeedPhraseContainer = getByTestId(
      "matching-seed-phrase-container"
    );
    await waitFor(() =>
      expect(originalSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    expect(continueButton).toBeDisabled();

    for (let index = 0; index < MNEMONIC_FIFTEEN_WORDS; index++) {
      fireEvent.click(originalSeedPhraseContainer.childNodes[0]);
    }

    await waitFor(() =>
      expect(matchingSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    for (let index = 0; index < MNEMONIC_FIFTEEN_WORDS; index++) {
      fireEvent.click(matchingSeedPhraseContainer.childNodes[0]);
    }

    expect(matchingSeedPhraseContainer.childNodes.length).toBe(1);
  });

  test("The user can not verify the Seed Phrase when Onboarding", async () => {
    const history = createMemoryHistory();
    history.push(RoutePath.VERIFY_SEED_PHRASE);
    const { getByTestId, getByText, queryByText } = render(
      <Provider store={storeMocked}>
        <Router history={history}>
          <VerifySeedPhrase />
        </Router>
      </Provider>
    );

    const continueButton = getByTestId("primary-button-verify-seed-phrase");
    const originalSeedPhraseContainer = getByTestId(
      "original-seed-phrase-container"
    );
    const matchingSeedPhraseContainer = getByTestId(
      "matching-seed-phrase-container"
    );
    await waitFor(() =>
      expect(originalSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    expect(continueButton).toBeDisabled();

    initialState.seedPhraseCache.seedPhrase160
      .split(" ")
      .forEach(async (word) => {
        fireEvent.click(getByText(`${word}`));
      });

    await waitFor(() =>
      expect(matchingSeedPhraseContainer.childNodes.length).toBe(
        MNEMONIC_FIFTEEN_WORDS
      )
    );

    await waitFor(() =>
      expect(continueButton).toHaveAttribute("disabled", "false")
    );

    fireEvent.click(continueButton);

    await waitFor(() =>
      expect(
        queryByText(EN_TRANSLATIONS.verifyseedphrase.alert.fail.text)
      ).toBeVisible()
    );
  });
});
