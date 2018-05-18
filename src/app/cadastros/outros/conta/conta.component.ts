import {Component, OnInit, TemplateRef} from '@angular/core';
import {ErrorHandlerService} from '../../../core/error-handler-service';
import {ToastyService} from 'ng2-toasty';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ContaService} from './conta.service';
import {Conta} from '../../../core/model';
import {FormControl} from '@angular/forms';
import {EmpresaService} from '../../empresa/empresa.service';
import {AgenciaService} from '../agencia/agencia.service';

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {

  contas = [];
  empresas = [];
  agencias = [];
  conta = new Conta();
  id: number;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService,
              private errorHandler: ErrorHandlerService,
              private toasty: ToastyService,
              private contaService: ContaService,
              private empresaService: EmpresaService,
              private agenciaService: AgenciaService) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.contaService.list().subscribe(dados => this.contas = dados,
      error1 => this.errorHandler.handle(error1));
  }

  getAllEmpresas() {
    this.empresaService.list().subscribe(dados => this.empresas = dados,
     error1 => this.errorHandler.handle(error1));
  }

  getAllAgencias() {
    this.agenciaService.list().subscribe(dados => this.agencias = dados,
      error1 => this.errorHandler.handle(error1));
  }

  getById(id: number) {
    this.contaService.read(id).subscribe(dado => this.conta = dado,
      error1 => this.errorHandler.handle(error1));
  }

  openFormModal(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.getAllEmpresas();
    this.getAllAgencias();
    if (id) {
      this.getById(id);
    } else {
      this.conta = new Conta();
    }
  }

  onSubmit(form) {
    if (this.editando) {
      this.updateModel(form);
    } else {
      this.createModel(form);
    }
  }

  createModel(form: FormControl) {
    this.contaService.create(this.conta).subscribe(() => {
        this.toasty.success({title: 'Parabéns!', msg: 'Conta cadastrada com sucesso.'});
        this.getAll();
        this.modalRef.hide();
        console.log(form.value);
      },
      err => this.errorHandler.handle(err));
  }

  updateModel(form: FormControl) {
    this.contaService.update(this.conta).subscribe(() => {
        this.toasty.success({title: 'Parabéns!', msg: 'Conta atualizada com sucesso.'});
        this.getAll();
        this.modalRef.hide();
      }
      , error1 => this.errorHandler.handle(error1));
  }

  delete(id: number) {
    this.contaService.delete(id).subscribe(() => {
        this.toasty.success({title: 'Parabéns!', msg: 'Conta excluída com sucesso.'});
        this.getAll();
      }
      , error1 => this.errorHandler.handle(error1));
  }

  openConfirmModal(template: TemplateRef<any>, id: number) {
    this.id = id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(id: number) {
    id = this.id;
    this.delete(id);
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }

  get editando(): any {
    return Boolean (this.conta.id);
  }

}
