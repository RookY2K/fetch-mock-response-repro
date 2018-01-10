import fetchMock from 'fetch-mock';
import App from "../App";

describe('repro', () => {
	let app;
	let response;

	beforeEach(() => {
		app = new App({});
		spyOn(app, 'setState');
	});

	afterEach(() => {
		fetchMock.restore();
	});

	describe('Setting status only in new Response init', () => {
		beforeEach(() => {
			response = new Response(null, {status: 500});
			fetchMock.get('https://www.example.com/', response);
		});

		it('Should set state with expected error message', (done) => {
			app.handleSubmit();

			expectAsync(() =>
				expect(app.setState).toBeCalledWith({error: 'Internal Server Error'}),
				done
			);
		});
	});

	describe('Setting status and statusText in new Response init', () => {
		beforeEach(() => {
			response = new Response(null, {status: 500, statusText: 'I failed'});
			fetchMock.get('https://www.example.com/', response);
		});

		it('Should set state with expected error message', (done) => {
			app.handleSubmit();

			expectAsync(() =>
				expect(app.setState).toBeCalledWith({error: response.statusText}),
				done
			);
		});
	});

	describe('Using status as the response', () => {
		beforeEach(() => {
			response = 500;
			fetchMock.get('https://www.example.com/', response);
		});

		it('Should set state with expected error message', (done) => {
			app.handleSubmit();

			expectAsync(() =>
				expect(app.setState).toBeCalledWith({error: 'Internal Server Error'}),
				done
			);
		});
	});

	describe('Using a response configuration object with only status set', () => {
		beforeEach(() => {
			response = {status: 500};
			fetchMock.get('https://www.example.com/', response);
		});

		it('Should set state with expected error message', (done) => {
			app.handleSubmit();

			expectAsync(() =>
				expect(app.setState).toBeCalledWith({error: 'Internal Server Error'}),
				done
			);
		});
	});

	describe('Using a response configuration object with status and statusText set', () => {
		beforeEach(() => {
			response = {status: 500, statusText: 'I failed!'};
			fetchMock.get('https://www.example.com/', response);
		});

		it('Should set state with result and response configuration on the body of the result response', (done) => {
			app.handleSubmit();

			expectAsync(() =>
				expect(app.setState).toBeCalledWith({result: response}),
				done
			);
		});
	});

});

const expectAsync = (expectation, done) => {
	setTimeout(() => {
		try{
			expectation();
			done();
		} catch(e) {
			done.fail(e);
		}
	})
};
