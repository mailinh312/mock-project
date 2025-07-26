import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Ability } from '@casl/ability';
import { CaslAbilityGuard } from './casl-ability.guard';
import { Auth } from '../service/auth';
import { AbilityService } from './ability.service';

describe('CaslAbilityGuard', () => {
  let guard: CaslAbilityGuard;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAbility: jasmine.SpyObj<Ability>;
  let mockAuth: jasmine.SpyObj<Auth>;
  let mockAbilityService: jasmine.SpyObj<AbilityService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const abilitySpy = jasmine.createSpyObj('Ability', ['can']);
    const authSpy = jasmine.createSpyObj('Auth', ['getCurrentUser']);
    const abilityServiceSpy = jasmine.createSpyObj('AbilityService', ['updateAbility']);

    TestBed.configureTestingModule({
      providers: [
        CaslAbilityGuard,
        { provide: Router, useValue: routerSpy },
        { provide: Ability, useValue: abilitySpy },
        { provide: Auth, useValue: authSpy },
        { provide: AbilityService, useValue: abilityServiceSpy }
      ]
    });

    guard = TestBed.inject(CaslAbilityGuard);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAbility = TestBed.inject(Ability) as jasmine.SpyObj<Ability>;
    mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    mockAbilityService = TestBed.inject(AbilityService) as jasmine.SpyObj<AbilityService>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user has permission', async () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { action: 'read', subject: 'user' };
    const state = {} as RouterStateSnapshot;

    mockAbilityService.updateAbility.and.returnValue(Promise.resolve());
    mockAbility.can.and.returnValue(true);

    const result = await guard.canActivate(route, state);

    expect(result).toBe(true);
    expect(mockAbilityService.updateAbility).toHaveBeenCalled();
    expect(mockAbility.can).toHaveBeenCalledWith('read', 'user');
  });

  it('should deny access when user lacks permission', async () => {
    const route = new ActivatedRouteSnapshot();
    route.data = { action: 'manage', subject: 'user' };
    const state = {} as RouterStateSnapshot;

    mockAbilityService.updateAbility.and.returnValue(Promise.resolve());
    mockAbility.can.and.returnValue(false);

    // Mock window.alert to avoid actual alert during test
    spyOn(window, 'alert');

    const result = await guard.canActivate(route, state);

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(window.alert).toHaveBeenCalledWith('Bạn không có quyền truy cập trang này.');
  });

  it('should use default values when route data is missing', async () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {}; // No action or subject specified
    const state = {} as RouterStateSnapshot;

    mockAbilityService.updateAbility.and.returnValue(Promise.resolve());
    mockAbility.can.and.returnValue(true);

    const result = await guard.canActivate(route, state);

    expect(result).toBe(true);
    expect(mockAbility.can).toHaveBeenCalledWith('read', 'all');
  });
});

